import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';
import { ShieldCheck, HelpCircle, Gift } from 'lucide-react';
import * as xrplService from '../blockchain/xrplService';

const API_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000'
  : 'http://localhost:3000';

const TokenFaucet = () => {
  const { walletAddress, isConnected, getTempBalance } = useUser();
  const [hasTrustline, setHasTrustline] = useState(null); // null: 확인 전, true: 설정됨, false: 설정 안됨
  const [faucetClaimed, setFaucetClaimed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const checkUserTrustline = useCallback(async () => {
    if (!walletAddress) return;
    setIsLoading(true);
    try {
      const result = await xrplService.checkTrustline(walletAddress);
      setHasTrustline(result);
    } catch (error) {
      setErrorMessage('신뢰선 확인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  // 지갑이 연결되면 신뢰선 상태를 자동으로 확인합니다.
  useEffect(() => {
    checkUserTrustline();
  }, [checkUserTrustline]);

  // "신뢰선 설정" 버튼 클릭 핸들러
  const handleSetTrustline = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setTxHash(null);

    try {
      const tx = await xrplService.createTrustSetTx(walletAddress);
      const result = await xrplService.signAndSubmitTx(tx, walletAddress, 'TrustSet');
      
      setTxHash(result.transactionHash);
      setHasTrustline(true); // 성공 시 상태를 true로 변경
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // "토큰 받기" 버튼 클릭 핸들러
  const handleClaimToken = async () => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Faucet API 호출 로직은 여전히 컴포넌트에 남아있을 수 있습니다.
      // 또는 xrplService로 옮겨도 좋습니다.
      const response = await fetch(`${API_URL}/api/chain/tokenfaucet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: walletAddress }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '토큰 지급에 실패했습니다.');
      }

      setFaucetClaimed(true);
      await getTempBalance(walletAddress); // Context의 잔액 갱신 함수 호출
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-xl shadow-lg text-center w-full max-w-lg">
        <div className="flex justify-center mb-4">
          <ShieldCheck className="w-12 h-12 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">토큰 수령 준비</h1>
        <p className="text-gray-600 mb-6">
          게임 토큰을 받으려면, 먼저 지갑에서 해당 토큰에 대한 신뢰선(Trustline)을 설정해야 합니다.
        </p>
        
        {/* 🔥 3. UI 렌더링 로직 단순화 */}
        {!hasTrustline && (
          <button
            onClick={handleSetTrustline}
            disabled={!isConnected || isLoading}
            className="w-full px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? '처리 중...' : '1. 신뢰선 설정하기'}
          </button>
        )}
        
        {hasTrustline && (
          <div className="mt-4">
             <p className="text-green-600 mb-4">✅ 신뢰선이 설정되었습니다!</p>
            <button
              onClick={handleClaimToken}
              disabled={isLoading || faucetClaimed}
              className="w-full px-6 py-3 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              <div className="flex items-center justify-center gap-2">
                <Gift className="w-5 h-5"/>
                <span>{faucetClaimed ? '✅ 토큰 수령 완료!' : isLoading ? '토큰 지급 중...' : '2. 테스트 토큰 받기'}</span>
              </div>
            </button>
          </div>
        )}
    
        <div className="mt-4 min-h-[50px]">
          {errorMessage && <p className="text-red-600">❌ 오류: {errorMessage}</p>}
          {txHash && (
             <a 
              href={`https://testnet.xrpl.org/transactions/${txHash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-500 underline break-all"
            >
              신뢰선 설정 영수증 확인
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenFaucet;