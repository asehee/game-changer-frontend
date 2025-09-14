// 플레이 세션 API 서비스
const API_BASE_URL = 'http://localhost:3000';

// 현재 활성 세션 조회 API 추가 - POST 메소드 사용 가능

class PlaySessionApiService {
  // 플레이 세션 시작
  static async startSession(gameId, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/play/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId,
          userId
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
  static async sendHeartbeat(sessionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/play/heartbeat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId
        }),
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
  static async stopSession(sessionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/play/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Stop Session API Error:', error);
      throw error;
    }
  }

  // 현재 활성 세션 조회
  static async getCurrentSession(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/play/current?userId=${encodeURIComponent(userId)}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null; // 활성 세션 없음
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