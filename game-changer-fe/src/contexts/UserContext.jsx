import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import DeveloperApiService from '../services/developerApi';
import UserApiService from '../services/userApi';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userBalance, setUserBalance] = useState(null);

  // 지갑 연결 (내부 함수)
  const _connectWallet = async (address) => {
    try {
      setLoading(true);
      
      // 사용자 정보 조회 또는 생성
      let userData;
      try {
        userData = await UserApiService.findOrCreateUser(address);
      } catch (error) {
        throw error;
      }

      setUser(userData);
      console.log(JSON.stringify(userData));
      setWalletAddress(address);
      setIsConnected(true);
      localStorage.setItem('connectedWallet', address);
      
      return userData;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 초기화 시 localStorage에서 지갑 주소 확인
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const savedWallet = localStorage.getItem('connectedWallet');        
        if (savedWallet) {
          await _connectWallet(savedWallet);
        }
      } catch (error) {
        console.error('Failed to initialize user:', error);
        // 에러 발생 시 localStorage 정리
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  // 지갑 연결 (외부용)
  const connectWallet = async (address) => {
    return _connectWallet(address);
  };

  // 지갑 연결 해제
  const disconnectWallet = () => {
    setUser(null);
    setWalletAddress(null);
    setIsConnected(false);
    localStorage.removeItem('connectedWallet');
  };

  // 사용자 정보 새로고침
  const refreshUser = async () => {
    if (!walletAddress) return;
    
    try {
      const userData = await UserApiService.getUserInfo(walletAddress);
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // 사용자 조회 실패 시 연결 해제
      disconnectWallet();
    }
  };

  // 잔액 조회 함수
  const getTempBalance = useCallback(async (address) => {
    if (!address) return;
    setIsBalanceLoading(true);
    try {
      const balanceData = await UserApiService.getUserBalance(address);
      console.log(JSON.stringify(balanceData))
      setUserBalance(balanceData);
    } catch (error) {
      console.error('Failed to get temp balance:', error);
    } finally {
      setIsBalanceLoading(false);
    }
  }, []);

  // 첫 충전 처리 함수
  const setupFirstCharge = useCallback(async (address) => {
    if (!address) return;
    setIsCharging(true);
    try {
      await UserApiService.setupFirstCharge(address);
      await _connectWallet(address)
    } catch (error) {
      console.error('Failed to setup first charge:', error);
      throw error;
    } finally {
      setIsCharging(false);
    }
  }, []);

  useEffect(() => {
    // user 객체가 존재하고, 첫 충전이 완료되었을 때 잔액 조회
    if (user && user.isFirstChargeCompleted && user.tempWallet) {
      getTempBalance(user.wallet); // user.wallet 대신 user.tempWallet이 더 적절할 수 있음
    }
  }, [user, getTempBalance]); // user 또는 getTempBalance 함수가 변경될 때 실행

  // 개발자 활성화
  const activateDeveloper = async () => {
    if (!walletAddress) throw new Error('지갑이 연결되지 않았습니다.');
    
    try {
      await DeveloperApiService.activateDeveloper(walletAddress);
      await refreshUser(); // 사용자 정보 새로고침
    } catch (error) {
      console.error('Failed to activate developer:', error);
      throw error;
    }
  };

  const value = {
    user,
    userBalance,
    walletAddress,
    loading,
    isConnected,
    isBalanceLoading,
    isCharging,
    connectWallet,
    disconnectWallet,
    refreshUser,
    activateDeveloper,
    getTempBalance,
    setupFirstCharge,
    // 외부에서 상태 직접 업데이트할 수 있도록
    setUserBalance,
    // 편의 속성들
    isLoggedIn: isConnected && user,
    isDeveloper: user?.isDeveloper || false,
    nickname: user?.nickname || 'Anonymous',
    userId: user?.id
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};