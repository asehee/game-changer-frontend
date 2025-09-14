// Developer API 서비스
const API_BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000' 
  : 'http://localhost:3000';

class DeveloperApiService {
  // 개발자 대시보드 데이터 가져오기
  static async getDashboard(walletAddress) {
    try {
      const response = await fetch(`${API_BASE_URL}/developers/dashboard?wallet=${encodeURIComponent(walletAddress)}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Developer Dashboard API Error:', error);
      throw error;
    }
  }

  // 게임별 상세 분석 데이터 가져오기
  static async getGameAnalytics(gameId, walletAddress) {
    try {
      const response = await fetch(`${API_BASE_URL}/developers/games/${gameId}/analytics?wallet=${encodeURIComponent(walletAddress)}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Game Analytics API Error:', error);
      throw error;
    }
  }

  // 지갑 주소로 사용자 조회/생성
  static async findOrCreateUser(walletAddress) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/wallet/${walletAddress}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet: walletAddress }),
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

  // 게임 업로드 시작
  static async startUploading(walletAddress) {
    try {
      const response = await fetch(`${API_BASE_URL}/developers/start-uploading?wallet=${encodeURIComponent(walletAddress)}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Start Uploading API Error:', error);
      throw error;
    }
  }

  // 개발자 상태 업데이트
  static async updateDeveloperStatus(walletAddress, isDeveloper) {
    try {
      const response = await fetch(`${API_BASE_URL}/developers/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          isDeveloper
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update Developer Status API Error:', error);
      throw error;
    }
  }
}

export default DeveloperApiService;