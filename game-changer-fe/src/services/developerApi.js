import * as xrplService from '../blockchain/xrplService';

// Developer API 서비스
const API_BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000' 
  : 'http://localhost:3000';

class DeveloperApiService {
  // 사용자 정보 가져오기 (isDeveloper 확인용)
  static async getUserInfo(walletAddress) {
    try {
      console.log(`Getting user info for wallet: ${walletAddress}`);
      const response = await fetch(`${API_BASE_URL}/api/users/wallet/${encodeURIComponent(walletAddress)}`);

      if (!response.ok) {
        // 404인 경우 사용자가 없다는 뜻이므로 find-or-create로 생성 시도
        if (response.status === 404) {
          console.log('User not found, creating new user...');
          const newUser = await this.findOrCreateUser(walletAddress);
          return newUser;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
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

  // 개발자 활성화
// 이 함수는 UserApiService.js 또는 DeveloperApiService.js와 같은 서비스 파일 내에 위치합니다.
static async activateDeveloper(walletAddress) {
  try {
    console.log(`Activating developer for wallet: ${walletAddress}`);
    const hasTrustline = await xrplService.checkTrustline(walletAddress);

    if (hasTrustline === false) {
      console.log("신뢰선이 없어 새로 생성 및 제출을 시작합니다.");
      const trustSetTx = await xrplService.createTrustSetTx(walletAddress);
      const submitResult = await xrplService.signAndSubmitTx(
        trustSetTx,
        walletAddress,
      );

      if (!submitResult || submitResult.status !== 'success') {
        // submitResult가 없거나, status가 'success'가 아닌 경우 에러를 발생시킵니다.
        throw new Error('백엔드에 신뢰선 트랜잭션을 제출하는 데 실패했습니다.');
      }
      
      console.log(`신뢰선 트랜잭션 제출 성공! Hash: ${submitResult.transactionHash}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    
    } else {
      console.log("신뢰선이 이미 설정되어 있습니다.");
    }

    // 3. 이제 백엔드에 최종적으로 개발자 활성화를 요청합니다.
    console.log(`API 호출: ${API_BASE_URL}/api/developers/activate`);
    const response = await fetch(`${API_BASE_URL}/api/developers/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress: walletAddress,
      }),
    });

    if (!response.ok) {
      // 백엔드가 보낸 JSON 에러 메시지를 우선적으로 사용하도록 개선
      const errorData = await response.json().catch(() => ({})); // JSON 파싱 실패 대비
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const finalResult = await response.json();
    console.log("개발자 활성화 최종 성공:", finalResult);
    return finalResult;

  } catch (error) {
    console.error('개발자 활성화 과정 중 오류 발생:', error);
    throw error; // 오류를 상위로 전파하여 호출한 컴포넌트가 알 수 있도록 함
  }
}

  // 개발자 대시보드 데이터 가져오기
  static async getDashboard(walletAddress) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/developers/dashboard?wallet=${encodeURIComponent(walletAddress)}`);

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
      const response = await fetch(`${API_BASE_URL}/api/developers/games/${gameId}/analytics?wallet=${encodeURIComponent(walletAddress)}`);

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

  // 게임 업로드 시작
  static async startUploading(walletAddress) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/developers/start-uploading?wallet=${encodeURIComponent(walletAddress)}`);

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
      const response = await fetch(`${API_BASE_URL}/api/developers/status`, {
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