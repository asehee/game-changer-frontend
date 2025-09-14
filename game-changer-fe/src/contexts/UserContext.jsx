import { createContext, useContext, useState, useEffect } from 'react';
import DeveloperApiService from '../services/developerApi';

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
  const [isConnected, setIsConnected] = useState(false);

  // 지갑 연결 (내부 함수)
  const _connectWallet = async (address) => {
    try {
      setLoading(true);
      
      // 사용자 정보 조회 또는 생성
      let userData;
      try {
        userData = await DeveloperApiService.getUserInfo(address);
      } catch (error) {
        if (error.message.includes('not found')) {
          // 사용자가 없으면 생성
          userData = await DeveloperApiService.findOrCreateUser(address);
        } else {
          throw error;
        }
      }

      setUser(userData);
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
        
        // 개발 중 잘못 저장된 test 데이터 정리 (임시)
        if (savedWallet === 'test') {
          console.warn('Development test wallet detected, clearing localStorage');
          localStorage.clear();
          return;
        }
        
        if (savedWallet && savedWallet !== 'test') {
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
      const userData = await DeveloperApiService.getUserInfo(walletAddress);
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // 사용자 조회 실패 시 연결 해제
      disconnectWallet();
    }
  };

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
    walletAddress,
    loading,
    isConnected,
    connectWallet,
    disconnectWallet,
    refreshUser,
    activateDeveloper,
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