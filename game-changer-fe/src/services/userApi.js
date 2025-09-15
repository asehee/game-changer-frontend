// Developer API 서비스
const API_BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000' 
  : 'http://localhost:3000';

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
  static async setupFirstCharge(connectedWallet) {
    try {
      console.log(`Setting up first charge for wallet: ${connectedWallet}`);
      //실제 첫충전 로직 여기서 tempAddress가 생성됨
      //지금은 그냥 임시로 tempAddress=connectedWallet
      const tempAddress = connectedWallet;
      console.log(`Token and xrp charged to ${tempAddress}`);
      const response = await fetch(`${API_BASE_URL}/api/users/first-charge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tempAddress: tempAddress,
            connectedWallet: connectedWallet
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Setup First Charge API Error:', error);
      throw error;
    }
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