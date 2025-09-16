import { Client, xrpToDrops, convertStringToHex } from 'xrpl';
import * as xrplService from '../blockchain/xrplService';

const API_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000'
  : 'http://localhost:3000';

let tokenMetadata = null; // 메모리 캐시

export const getTokenMetadata = async () => {
  // 메모리에 캐시된 데이터가 있으면 즉시 반환
  if (tokenMetadata) {
    return tokenMetadata;
  }
  // 로컬 스토리지에 캐시된 데이터가 있으면 가져와서 사용
  const cachedData = localStorage.getItem('tokenMetadata');
  if (cachedData) {
    tokenMetadata = JSON.parse(cachedData);
    return tokenMetadata;
  }
  // 캐시가 없으면 API 호출
  try {
    const response = await fetch(`${API_URL}/api/chain/token-metadata`);
    if (!response.ok) throw new Error('Failed to fetch token metadata');
    const data = await response.json();
    tokenMetadata = data;
    localStorage.setItem('tokenMetadata', JSON.stringify(data)); // 로컬 스토리지에 저장
    return data;
  } catch (error) {
    console.error("토큰 메타데이터 로딩 실패:", error);
    throw error;
  }
};

export const checkTrustline = async (walletAddress) => {
  const metadata = await getTokenMetadata();
  const client = new Client(metadata.testnet);
  await client.connect();
  
  try {
    const response = await client.request({
      command: 'account_lines',
      account: walletAddress,
      peer: metadata.issuer_address,
    });
    await client.disconnect();
    
    const hasTrustline = response.result.lines.some(
      line => line.currency === metadata.token_currency_code
    );
    return hasTrustline;

  } catch (error) {
    await client.disconnect();
    if (error.data?.error === 'actNotFound') {
        return false;
    }
    console.error("신뢰선 확인 중 오류:", error);
    throw error;
  }
};

export const createTrustSetTx = async (walletAddress) => {
  const metadata = await getTokenMetadata();
  return {
    TransactionType: 'TrustSet',
    Account: walletAddress,
    LimitAmount: {
      issuer: metadata.issuer_address,
      currency: metadata.token_currency_code,
      value: '10000000000', // 충분히 큰 값
    },
  };
};

export const createXrpPaymentTx = (fromAddress, toAddress, amountXRP) => {
  return {
    TransactionType: 'Payment',
    Account: fromAddress,
    Destination: toAddress,
    Amount: xrpToDrops(amountXRP),
  };
};

export const createTokenPaymentTx = async (fromAddress, toAddress, amountToken) => {
    const metadata = await getTokenMetadata();
    return {
        TransactionType: 'Payment',
        Account: fromAddress,
        Destination: toAddress,
        Amount: {
            issuer: metadata.issuer_address,
            currency: metadata.token_currency_code,
            value: amountToken.toString(),
        },
    };
};

export const createSignerListSetTx = async (tempAddress, userAddress) => {
  const metadata = await getTokenMetadata();
  return {
    TransactionType: "SignerListSet",
    Account: tempAddress,
    SignerQuorum: 1, // 1명의 서명만으로 트랜잭션 승인
    SignerEntries: [
        {
            SignerEntry: {
                Account: userAddress, // 사용자의 본 지갑 주소
                SignerWeight: 1,
            }
        },
        {
            SignerEntry: {
                Account: metadata.server_address, // dApp 서버의 지갑 주소
                SignerWeight: 1,
            }
        }
    ]
  }; 
};

export const signTx = async (transaction) => {
  console.log(`[${transaction.TransactionType}] 서명 요청 시작...`, JSON.stringify(transaction));
  try {
    if (typeof window.GemWalletApi === 'undefined') {
      alert("GemWallet API가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      console.error("GemWalletApi is not available on the window object.");
      return;
    }
    const signResponse = await window.GemWalletApi.signTransaction({ transaction });
    const signedTx = signResponse.result?.signature;
    if (!signedTx) throw new Error("서명 데이터가 없습니다.");
  } catch (error) {
    console.error(`getWallet 서명 처리 중 오류:`, error);
    throw error;
  }
};

export const signAndSubmitTx = async (transaction, walletAddress) => {
  const txType = transaction.TransactionType;
  console.log(`[${txType}] 서명 요청 시작...`, JSON.stringify(transaction));
  try {
    if (typeof window.GemWalletApi === 'undefined') {
      alert("GemWallet API가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      console.error("GemWalletApi is not available on the window object.");
      return;
    }
    const signResponse = await window.GemWalletApi.signTransaction({ transaction });
    const signedTx = signResponse.result?.signature;
    if (!signedTx) throw new Error("서명 데이터가 없습니다.");
    
    console.log(`[${txType}] 서명 완료, 백엔드에 제출 중...`);

    // 서명된 트랜잭션을 백엔드에 제출
    const submitResponse = await fetch(`${API_URL}/api/chain/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        txType: txType,
        walletAddress: walletAddress,
        signedTransaction: signedTx,
      }),
    });

    if (!submitResponse.ok) {
      const errorData = await submitResponse.json();
      throw new Error(errorData.message || '백엔드 제출에 실패했습니다.');
    }
    
    const result = await submitResponse.json();
    console.log(`[${txType}] 제출 성공!`, result);
    return result;

  } catch (error) {
    console.error(`[${txType}] 처리 중 오류:`, error);
    throw error;
  }
};

export const submitTxWithTemp = async (transaction, tempWallet) => {
  const metadata = await getTokenMetadata();
  const client = new Client(metadata.testnet);
  await client.connect();

  try {
    const result = await client.submitAndWait(transaction, { wallet: tempWallet });
    
    const meta = result.result.meta;
    if (meta?.TransactionResult !== 'tesSUCCESS') {
      console.error(`[Frontend] 트랜잭션 실패! 상세 정보:`, result);
      throw new Error(`Transaction failed on ledger: ${meta?.TransactionResult || 'Unknown Error'}`);
    }

    console.log(`[Frontend] 트랜잭션 성공! Hash: ${result.result.hash}`);
    return result;

  } catch (error) {
    console.error(`[Frontend] 트랜잭션 제출 중 오류:`, error);
    throw error;
  }
};