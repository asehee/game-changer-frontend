import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';
import { ShieldCheck, HelpCircle, Gift } from 'lucide-react';
import * as xrplService from '../blockchain/xrplService';
import { useTranslation } from '../hooks/useTranslation';

const API_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000'
  : 'http://localhost:3000';

const TokenFaucet = () => {
  const { t } = useTranslation();
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
      setErrorMessage(t('trustlineError'));
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

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
      const requestData = { walletAddress: walletAddress };
      console.log('[TokenFaucet] Sending request to /api/chain/tokenfaucet:', requestData);
      
      const response = await fetch(`${API_URL}/api/chain/tokenfaucet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[TokenFaucet] API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData
        });
        throw new Error(errorData.message || t('claimFailed'));
      }

      const responseData = await response.json();
      console.log('[TokenFaucet] API Success Response:', responseData);
      
      setFaucetClaimed(true);
      //await getTempBalance(walletAddress); // Context의 잔액 갱신 함수 호출
    } catch (error) {
      console.error('[TokenFaucet] Request failed:', error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Glassmorphism Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/src/assets/bg.png')`,
        }}
      />
      <div className="bg-black/30 fixed inset-0" />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl text-center w-full max-w-lg">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t('faucetTitle')}</h1>
          <p className="text-white/80 mb-6">
            {t('faucetDescription')}
          </p>
        
        {/* 🔥 3. UI 렌더링 로직 단순화 */}
        {!hasTrustline && (
          <button
            onClick={handleSetTrustline}
            disabled={!isConnected || isLoading}
            className="w-full px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? t('processing') : t('stepSetTrustline')}
          </button>
        )}
        
        {hasTrustline && (
          <div className="mt-4">
             <p className="text-green-400 mb-4">{t('trustlineSuccess')}</p>
            <button
              onClick={handleClaimToken}
              disabled={isLoading || faucetClaimed}
              className="w-full px-6 py-3 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              <div className="flex items-center justify-center gap-2">
                <Gift className="w-5 h-5"/>
                <span>{faucetClaimed ? t('tokenClaimed') : isLoading ? t('tokenProcessing') : t('stepClaimToken')}</span>
              </div>
            </button>
          </div>
        )}
    
        <div className="mt-4 min-h-[50px]">
          {errorMessage && <p className="text-red-400">{t('errorPrefix') + errorMessage}</p>}
          {txHash && (
             <a 
              href={`https://testnet.xrpl.org/transactions/${txHash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-400 underline break-all hover:text-blue-300 transition-colors"
            >
              {t('txReceipt')}
            </a>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default TokenFaucet;