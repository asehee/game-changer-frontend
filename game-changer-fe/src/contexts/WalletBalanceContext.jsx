import { createContext, useContext, useState, useEffect } from 'react';
import DeveloperApiService from '../services/developerApi';

const WalletBalanceContext = createContext();

export const useWalletBalance = () => {
  const context = useContext(WalletBalanceContext);
  if (!context) {
    throw new Error('useWalletBalance must be used within a WalletBalanceProvider');
  }
  return context;
};

export const WalletBalanceProvider = ({ children }) => {
  const [userBalance, setUserBalance] = useState(null);
  const [hasWallet, setHasWallet] = useState(false);
  const [loading, setLoading] = useState(false);

  // 잔액 조회 함수
  const fetchBalance = async (walletAddress) => {
    if (!walletAddress) {
      setHasWallet(false);
      setUserBalance(null);
      return;
    }

    setLoading(true);
    try {
      const balanceData = await DeveloperApiService.getUserBalance(walletAddress);
      
      // 새로운 API 응답 구조에 따른 처리
      if (balanceData.hasUser && balanceData.hasTempWallet) {
        // 사용자도 있고 임시 지갑도 있는 경우
        setHasWallet(true);
        setUserBalance(parseFloat(balanceData.tokenBalance?.value || '0'));
        console.log('Balance fetched - User exists, temp wallet exists:', balanceData.tokenBalance?.value);
      } else if (balanceData.hasUser && !balanceData.hasTempWallet) {
        // 사용자는 있지만 임시 지갑이 없는 경우
        setHasWallet(false);
        setUserBalance(null);
        console.log('User exists but no temp wallet - showing charge button');
      } else if (!balanceData.hasUser) {
        // 사용자가 존재하지 않는 경우 - 자동으로 사용자 생성
        console.log('User not found, creating user...');
        try {
          await DeveloperApiService.findOrCreateUser(walletAddress);
          // 사용자 생성 후에도 임시 지갑은 아직 없음
          setHasWallet(false);
          setUserBalance(null);
          console.log('User created - no temp wallet yet');
        } catch (createError) {
          console.error('Failed to create user:', createError);
          setHasWallet(false);
          setUserBalance(null);
        }
      }
    } catch (error) {
      console.error('Failed to get balance:', error);
      // API 자체가 실패한 경우
      setHasWallet(false);
      setUserBalance(null);
    } finally {
      setLoading(false);
    }
  };

  // 첫 충전 처리 함수
  const setupFirstCharge = async (walletAddress) => {
    if (!walletAddress) return;

    setLoading(true);
    try {
      await DeveloperApiService.setupFirstCharge(walletAddress);
      console.log('First charge setup completed');
      
      // 임시 지갑 생성 완료 후 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 충전 후 잔액 다시 조회 (새로운 API 구조 사용)
      try {
        const balanceData = await DeveloperApiService.getUserBalance(walletAddress);
        
        if (balanceData.hasTempWallet) {
          setHasWallet(true);
          setUserBalance(parseFloat(balanceData.tokenBalance?.value || '0'));
          console.log('First charge completed successfully - temp wallet created');
        } else {
          // 임시 지갑 생성이 아직 완료되지 않은 경우
          console.warn('First charge API succeeded but temp wallet not yet available');
          setHasWallet(false);
          setUserBalance(null);
        }
      } catch (error) {
        console.warn('Failed to fetch balance after first charge, but charge API succeeded');
        // 첫 충전 API가 성공했다면 임시 지갑이 생성된 것으로 가정
        setHasWallet(true);
        setUserBalance(0);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to setup first charge:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    userBalance,
    hasWallet,
    loading,
    fetchBalance,
    setupFirstCharge,
    // 외부에서 상태 직접 업데이트할 수 있도록
    setUserBalance,
    setHasWallet
  };

  return (
    <WalletBalanceContext.Provider value={value}>
      {children}
    </WalletBalanceContext.Provider>
  );
};