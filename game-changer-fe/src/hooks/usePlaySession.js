import { useState, useEffect, useCallback, useRef } from 'react';
import PlaySessionApiService from '../services/playSessionApi';
import { checkSessionExpiration, getTokenPayload } from '../utils/jwt';

// 플레이 세션을 관리하는 커스텀 훅
export const usePlaySession = (gameId, walletAddress) => {
  const [sessionToken, setSessionToken] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [activePlayTime, setActivePlayTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playTime, setPlayTime] = useState(0);
  const [cost, setCost] = useState(0);

  const heartbeatInterval = useRef(null);
  const playTimeInterval = useRef(null);
  const startTime = useRef(null);

  const cleanupIntervals = useCallback(() => {
    if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
    if (playTimeInterval.current) clearInterval(playTimeInterval.current);
    heartbeatInterval.current = null;
    playTimeInterval.current = null;
  }, []);

  // 플레이 시간 업데이트 (1초마다)
  const updatePlayTime = useCallback(() => {
    if (startTime.current) {
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
      setPlayTime(elapsed);
    }
  }, []);

  const startHeartbeatAndTimer = useCallback((initialToken, initialPlayTime = 0) => {
    cleanupIntervals(); // 기존 인터벌이 있다면 정리
    setSessionToken(initialToken);
    setIsPlaying(true);
    setError(null);
    startTime.current = Date.now() - (initialPlayTime * 1000); // 밀리초 단위로 변환
    
    const sendHeartbeat = async () => {
      // 클로저 문제를 피하기 위해, 항상 최신 토큰을 가져오도록 함
      setSessionToken(currentToken => {
        if (!currentToken) {
          cleanupIntervals();
          return null;
        }
        console.log("Sending heartbeat with token:", currentToken);
        PlaySessionApiService.sendHeartbeat(currentToken)
          .then(res => {
            if (res.sessionToken) {
              console.log("Heartbeat success, new token:", res.sessionToken);
              setSessionToken(res.sessionToken); // 새 토큰으로 갱신
              setTotalCost(Number(res.totalCost));
              setActivePlayTime(res.activePlayTime);
            }
          })
          .catch(err => {
            console.error('Heartbeat failed:', err);
            setError('연결이 불안정합니다. 게임을 다시 시작해주세요.');
            cleanupIntervals();
            setIsPlaying(false);
          });
        return currentToken;
      });
    };
    
    sendHeartbeat(); // 즉시 1회 실행)

    heartbeatInterval.current = setInterval(sendHeartbeat, 30000); // 30초마다 반복
    playTimeInterval.current = setInterval(updatePlayTime, 1000);

  }, [cleanupIntervals, updatePlayTime]);

  // 플레이 세션 시작
  const startPlay = useCallback(async () => {
    if (!gameId || !walletAddress) return;

    setLoading(true);
    setError(null);

    try {
      const res = await PlaySessionApiService.getCurrentSession(walletAddress);
  
      if (res.hasActiveSession && res.sessionInfo) {
        if (checkSessionExpiration(res.sessionInfo.expiresAt)) {
          // 유효한 세션이 있는 경우 -> 이어하기
          console.log("기존 세션을 이어합니다.", res.sessionInfo);
          startHeartbeatAndTimer(res.sessionInfo.sessionToken, res.sessionInfo.activePlayTime);
          return;
        } else {
          // 세션이 있지만 만료된 경우
          console.log("만료된 세션을 정리하고 새로운 세션을 시작합니다.");
          await stopPlay(); // 기존 세션 정리
          const newSession = await PlaySessionApiService.startSession(walletAddress, gameId);
          setTotalCost(Number(newSession.totalCost));
          startHeartbeatAndTimer(newSession.sessionToken);
          return;
        }
      }
    
      // 세션이 없는 경우 -> 새로운 세션 시작
      console.log("새로운 세션을 시작합니다.");
      const newSession = await PlaySessionApiService.startSession(walletAddress, gameId);
      setTotalCost(Number(newSession.totalCost));
      startHeartbeatAndTimer(newSession.sessionToken);
    
    } catch (error) {
      setError(error.message);
      setIsPlaying(false);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [gameId, walletAddress, startHeartbeatAndTimer]);

  // 플레이 세션 중지
  const stopPlay = useCallback(async () => {
    if (!sessionToken) return;

    setLoading(true);
    setError(null);
    
    try {
      await PlaySessionApiService.stopSession(sessionToken);
      cleanupIntervals(); // 모든 타이머 정리
      
      // 상태 초기화
      setIsPlaying(false);
      setSessionToken(null);
      setActivePlayTime(0);
      startTime.current = null;
      setPlayTime(0);
      
    } catch (error) {
      console.error('Failed to stop session:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [sessionToken, cleanupIntervals]);

  // 컴포넌트 언마운트 시 모든 인터벌 정리
  useEffect(() => {
    return () => cleanupIntervals();
  }, [cleanupIntervals]);

  // 브라우저 탭 전환 시 처리
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!isPlaying) return;
      if (document.hidden) {
        cleanupIntervals();
      } else {
        startHeartbeatAndTimer(sessionToken, playTime);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying, sessionToken, playTime, startHeartbeatAndTimer, cleanupIntervals]);

  return {
    isPlaying,
    loading,
    error,
    playTime,
    totalCost,
    startPlay,
    stopPlay,
  };
};