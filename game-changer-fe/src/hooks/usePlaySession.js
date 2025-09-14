import { useState, useEffect, useCallback, useRef } from 'react';
import PlaySessionApiService from '../services/playSessionApi';

// 플레이 세션을 관리하는 커스텀 훅
export const usePlaySession = (gameId, walletAddress) => {
  const [session, setSession] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playTime, setPlayTime] = useState(0);
  const [cost, setCost] = useState(0);

  const heartbeatInterval = useRef(null);
  const playTimeInterval = useRef(null);
  const startTime = useRef(null);

  // 하트비트 전송 (30초마다)
  const sendHeartbeat = useCallback(async () => {
    if (!session?.id) return;

    try {
      const response = await PlaySessionApiService.sendHeartbeat(session.id);
      if (response.session) {
        setSession(response.session);
        setCost(response.session.totalCost || 0);
      }
    } catch (error) {
      console.error('Heartbeat failed:', error);
      setError('연결이 불안정합니다. 게임을 다시 시작해주세요.');
    }
  }, [session?.id]);

  // 플레이 시간 업데이트 (1초마다)
  const updatePlayTime = useCallback(() => {
    if (startTime.current) {
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
      setPlayTime(elapsed);
      // 실시간 비용 계산 (초당 0.001 달러)
      setCost(elapsed * 0.001);
    }
  }, []);

  // 플레이 세션 시작
  const startPlay = useCallback(async () => {
    if (!gameId || !walletAddress) {
      setError('게임 ID 또는 지갑 주소가 필요합니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await PlaySessionApiService.startSession(gameId, walletAddress);
      
      setSession(response.session);
      setIsPlaying(true);
      startTime.current = Date.now();
      
      // 하트비트 시작 (30초마다)
      heartbeatInterval.current = setInterval(sendHeartbeat, 30000);
      
      // 플레이 시간 업데이트 시작 (1초마다)
      playTimeInterval.current = setInterval(updatePlayTime, 1000);
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [gameId, walletAddress, sendHeartbeat, updatePlayTime]);

  // 플레이 세션 중지
  const stopPlay = useCallback(async () => {
    if (!session?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await PlaySessionApiService.stopSession(session.id);
      
      // 인터벌 정리
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = null;
      }
      if (playTimeInterval.current) {
        clearInterval(playTimeInterval.current);
        playTimeInterval.current = null;
      }

      setIsPlaying(false);
      setSession(null);
      startTime.current = null;
      setPlayTime(0);
      setCost(0);
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [session?.id]);

  // 현재 활성 세션 확인
  const checkCurrentSession = useCallback(async () => {
    if (!walletAddress) return;

    try {
      const currentSession = await PlaySessionApiService.getCurrentSession(walletAddress);
      if (currentSession) {
        setSession(currentSession.session);
        setIsPlaying(true);
        startTime.current = Date.now() - (currentSession.session.activePlayTime * 1000);
        
        // 기존 세션이 있다면 하트비트와 타이머 재시작
        heartbeatInterval.current = setInterval(sendHeartbeat, 30000);
        playTimeInterval.current = setInterval(updatePlayTime, 1000);
      }
    } catch (error) {
      console.error('Check current session failed:', error);
    }
  }, [walletAddress, sendHeartbeat, updatePlayTime]);

  // 컴포넌트 마운트 시 현재 세션 확인
  useEffect(() => {
    checkCurrentSession();
  }, [checkCurrentSession]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
      if (playTimeInterval.current) {
        clearInterval(playTimeInterval.current);
      }
    };
  }, []);

  // 브라우저 탭 전환 시 처리
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        // 탭이 숨겨지면 하트비트 간격 늘리기
        if (heartbeatInterval.current) {
          clearInterval(heartbeatInterval.current);
          heartbeatInterval.current = setInterval(sendHeartbeat, 60000); // 1분마다
        }
      } else if (!document.hidden && isPlaying) {
        // 탭이 다시 보이면 정상 간격으로 복구
        if (heartbeatInterval.current) {
          clearInterval(heartbeatInterval.current);
          heartbeatInterval.current = setInterval(sendHeartbeat, 30000); // 30초마다
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying, sendHeartbeat]);

  return {
    session,
    isPlaying,
    loading,
    error,
    playTime,
    cost,
    startPlay,
    stopPlay,
    checkCurrentSession
  };
};