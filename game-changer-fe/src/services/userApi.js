import { Wallet } from 'xrpl';
import * as xrplService from '../blockchain/xrplService';

// Developer API 서비스
const API_BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000' 
  : 'http://localhost:3000';

class CustomError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = 'CustomError';
  }
}

class UserApiService {
  // 사용자 정보 가져오기 (isFiratChargeCompleted와 tempWallet확인용)
  static async getUserInfo(walletAddress) {
    try {
        console.log(`Getting user info for wallet: ${walletAddress}`);
        const res = await this.findOrCreateUser(walletAddress);
        return res;
    } catch (error) {
      console.error('Get User Info API Error:', error);
      throw error;
    }
  }

  // 지갑 주소로 사용자 조회/생성
  static async findOrCreateUser(walletAddress) {
    try {
      console.log(`Finding or creating user for wallet: ${walletAddress}`);
      const response = await fetch(`${API_BASE_URL}/api/users/find-or-create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: walletAddress }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Find or Create User API Error:', error);
      throw error;
    }
  }

  // 첫 충전 처리 (임시 지갑 설정)
  static async setupFirstCharge(connectedWallet, iouAmount, xrpAmount) {
    console.log(typeof(xrpAmount))
    try {
      // 임시 지갑 생성
      const tempWallet = Wallet.generate();
      
      // XRP 전송으로 임시 지갑 활성화
      const xrpTxResult = await this.#sendXRPToTempWallet(
        connectedWallet, 
        tempWallet.address, 
        xrpAmount
      );
  
      // TrustSet 설정
      const trustSetResult = await this.#setupTrustLine(
        tempWallet
      );
  
      // 토큰 전송
      const tokenTxResult = await this.#sendTokensToTempWallet(
        connectedWallet,
        tempWallet.address, 
        iouAmount
      );
  
      // 서명 권한 위임
      const signerResult = await this.#setupSignerList(
        tempWallet,
        connectedWallet
      );
  
      // 백엔드 등록
      return await this.#registerWithBackend(tempWallet.address, connectedWallet);
  
    } catch (error) {
      console.error('First charge setup failed:', error);
      throw new CustomError('SETUP_FAILED', error.message);
    }
  }
  
  // Private helper methods
  static async #sendXRPToTempWallet(from, to, amount) {
    const tx = xrplService.createXrpPaymentTx(from, to, amount);
    const result = await xrplService.signAndSubmitTx(tx, from);
    
    if (!result?.status === 'success') {
      throw new CustomError('XRP_TRANSFER_FAILED', 'Failed to send XRP to temporary wallet');
    }
    return result;
  }
  
  static async #setupTrustLine(tempWallet) {
    const tx = await xrplService.createTrustSetTx(tempWallet.address);
    const result = await xrplService.submitTxWithTemp(tx, tempWallet);
  
    if (!result?.result?.meta?.TransactionResult === 'tesSUCCESS') {
      throw new CustomError('TRUST_SET_FAILED', 'Failed to setup trust line');
    }
    return result;
  }
  
  static async #sendTokensToTempWallet(from, to, amount) {
    const tx = await xrplService.createTokenPaymentTx(from, to, amount);
    const result = await xrplService.signAndSubmitTx(tx, from);
  
    if (!result?.result?.meta?.TransactionResult === 'tesSUCCESS') {
      throw new CustomError('TOKEN_TRANSFER_FAILED', 'Failed to send tokens to temporary wallet');
    }
    return result;
  }
  
  static async #setupSignerList(tempWallet, connectedWallet) {
    const tx = await xrplService.createSignerListSetTx(tempWallet.address, connectedWallet);
    const result = await xrplService.submitTxWithTemp(tx, tempWallet);
  
    if (!result?.result?.meta?.TransactionResult === 'tesSUCCESS') {
      throw new CustomError('SIGNER_SETUP_FAILED', 'Failed to setup signer list');
    }
    return result;
  }
  
  static async #registerWithBackend(tempAddress, connectedWallet) {
    const response = await fetch(`${API_BASE_URL}/api/users/first-charge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempAddress: tempAddress, connectedWallet: connectedWallet })
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new CustomError(
        'BACKEND_REGISTRATION_FAILED', 
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
  
    return await response.json();
  }

  // 사용자 잔액 조회
  static async getUserBalance(walletAddress) {
    try {
      console.log(`Getting balance for wallet: ${walletAddress}`);
      const response = await fetch(`${API_BASE_URL}/api/users/balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: walletAddress
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get User Balance API Error:', error);
      throw error;
    }
  }
}

export default UserApiService;