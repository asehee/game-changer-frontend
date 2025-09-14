import { useState, useEffect, useCallback } from 'react';
import DeveloperApiService from '../services/developerApi';

// 개발자 대시보드 데이터를 관리하는 커스텀 훅
export const useDeveloperDashboard = (walletAddress) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    if (!walletAddress) return;

    setLoading(true);
    setError(null);
    
    try {
      const dashboardData = await DeveloperApiService.getDashboard(walletAddress);
      setData(dashboardData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboard
  };
};

// 게임 분석 데이터를 관리하는 커스텀 훅
export const useGameAnalytics = (gameId, walletAddress) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    if (!gameId || !walletAddress) return;

    setLoading(true);
    setError(null);
    
    try {
      const analyticsData = await DeveloperApiService.getGameAnalytics(gameId, walletAddress);
      setData(analyticsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [gameId, walletAddress]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics
  };
};