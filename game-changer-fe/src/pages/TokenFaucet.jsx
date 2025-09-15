import React, { useState, useEffect, useCallback} from 'react';
import { useUser } from '../contexts/UserContext'; // UserContext 경로 확인 필요
import * as GemWalletApi from '@gemwallet/api';
import { ShieldCheck, HelpCircle, Gift } from 'lucide-react';

// ❗️ 백엔드 서버 주소 (환경 변수로 관리하는 것이 이상적)
const API_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000'
  : 'http://localhost:3000';

const TokenFaucet = () => {
    const { walletAddress, isConnected, getTempBalance } = useUser();
    const [tokenMeta, setTokenMeta] = useState(null);
    const [trustSetStatus, setTrustSetStatus] = useState('idle'); // 'idle', 'signing', 'submitting', 'success', 'error'
    const [faucetStatus, setFaucetStatus] = useState('idle'); // 'idle', 'claiming', 'success', 'error'
    const [trustSetHash, setTrustSetHash] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // 페이지 로드 시 토큰 메타데이터 가져오기
    useEffect(() => {
        const fetchTokenMetadata = async () => {
        try {
            const response = await fetch(`${API_URL}/api/chain/token-metadata`);
            if (!response.ok) throw new Error('Failed to fetch token metadata');
            const data = await response.json();
            setTokenMeta(data);
        } catch (error) {
            console.error(error);
            setErrorMessage('토큰 정보를 불러오는 데 실패했습니다.');
        }
        };
        fetchTokenMetadata();
    }, []);

    // "신뢰선 설정" 버튼 클릭 핸들러
    const handleSetTrustline = useCallback(async () => {
        if (!isConnected) {
            alert("지갑을 먼저 연결해주세요.");
            return; // 함수 실행 중단
        }
      
        if (!tokenMeta) return;

        setTrustSetStatus('signing');
        setErrorMessage('');
        setTrustSetHash(null);

        const trustSetTx = {
            TransactionType: 'TrustSet',
            Account: walletAddress,
            LimitAmount: {
                issuer: tokenMeta.issuer_address,
                currency: tokenMeta.token_currency_code,
                value: '10000000000',
            },
        };

        try {
            const signResponse = await GemWalletApi.signTransaction({ transaction: trustSetTx });
            const signedTx = signResponse.result?.signature;
            if (!signedTx) throw new Error("서명 데이터가 없습니다.");
            
            setTrustSetStatus('submitting');

            const submitResponse = await fetch(`${API_URL}/api/chain/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                txType: 'TrustSet',
                walletAddress: walletAddress,
                signedTransaction: signedTx,
                }),
            });

            if (!submitResponse.ok) {
                const errorData = await submitResponse.json();
                throw new Error(errorData.message || '트랜잭션 제출에 실패했습니다.');
            }
            
            const result = await submitResponse.json();
                setTrustSetHash(result.transactionHash);
                setTrustSetStatus('success');

        } catch (error) {
            setErrorMessage(error.message);
            setTrustSetStatus('error');
        }
    }, [isConnected, tokenMeta, walletAddress]);

    // 🔥 "토큰 받기" 버튼 클릭 핸들러
    const handleClaimToken = useCallback(async () => {
        if (!isConnected) return;

        setFaucetStatus('claiming');
        setErrorMessage('');

        try {
        const response = await fetch(`${API_URL}/api/chain/tokenfaucet`, { // Faucet API 엔드포인트
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress: walletAddress }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '토큰 지급에 실패했습니다.');
        }
            setFaucetStatus('success');
            if(walletAddress) {
                await getTempBalance(walletAddress);
              }
        } catch (error) {
            setErrorMessage(error.message);
            setFaucetStatus('error');
        }
    }, [isConnected, walletAddress, getTempBalance]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="p-8 bg-white rounded-xl shadow-lg text-center w-full max-w-lg">
            <div className="flex justify-center mb-4">
              <ShieldCheck className="w-12 h-12 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">토큰 수령 준비</h1>
            <p className="text-gray-600 mb-6">
              게임 토큰({tokenMeta?.token_currency_code || '...'})을 받으려면, 먼저 지갑에서 해당 토큰에 대한 신뢰선(Trustline)을 설정해야 합니다.
            </p>
            
            {/* 신뢰선 설정 버튼 */}
            <button
              onClick={handleSetTrustline}
              disabled={!tokenMeta || trustSetStatus === 'signing' || trustSetStatus === 'submitting' || trustSetStatus === 'success'}
              className="w-full px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-all duration-300"
            >
              {trustSetStatus === 'success' ? '✅ 신뢰선 설정 완료' : trustSetStatus === 'signing' || trustSetStatus === 'submitting' ? '처리 중...' : '1. 신뢰선 설정하기'}
            </button>
    
            {/* 신뢰선 설정 후 나타나는 토큰 받기 버튼 */}
            {trustSetStatus === 'success' && (
              <div className="mt-4">
                <button
                  onClick={handleClaimToken}
                  disabled={faucetStatus === 'claiming' || faucetStatus === 'success'}
                  className="w-full px-6 py-3 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-all duration-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Gift className="w-5 h-5"/>
                    <span>{faucetStatus === 'success' ? '✅ 토큰 수령 완료!' : faucetStatus === 'claiming' ? '토큰 지급 중...' : '2. 테스트 토큰 받기'}</span>
                  </div>
                </button>
              </div>
            )}
    
            <div className="mt-4 min-h-[50px]">
              {/* 에러 메시지는 공통으로 표시 */}
              {errorMessage && <p className="text-red-600">❌ 오류: {errorMessage}</p>}
            </div>
          </div>
        </div>
      );
};

export default TokenFaucet;