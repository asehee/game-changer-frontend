const API_BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000' 
  : 'http://localhost:3000';

class PlaySessionApiService {
  // 플레이 세션 시작
  static async startSession(walletAddress, gameId) {
    try {
      console.log("startSession")
      const response = await fetch(`${API_BASE_URL}/api/play/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: walletAddress,
          gameId: gameId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Start Session API Error:', error);
      throw error;
    }
  }

  // 하트비트 전송 (세션 유지)
  static async sendHeartbeat(sessionToken) {
    try {
      const response = await fetch(API_BASE_URL + "/api/play/heartbeat", {
        method: "POST",
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Heartbeat API Error:', error);
      throw error;
    }
  }

  // 플레이 세션 중지
  static async stopSession(sessionToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/play/stop`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

    } catch (error) {
      console.error('Stop Session API Error:', error);
      throw error;
    }
  }

  // 현재 활성 세션 정보 조회
  static async getCurrentSession(walletAddress) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/play/current?wallet=${walletAddress}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get Current Session API Error:', error);
      throw error;
    }
  }

  static async getSessionById(sessionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/play/sessions/${sessionId}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null; // 해당 id의 session없음
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get Current Session API Error:', error);
    throw error;
  }
}
}

export default PlaySessionApiService;