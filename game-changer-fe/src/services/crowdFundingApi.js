const API_BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000' 
  : 'http://localhost:3000';

class CrowdFundingApiService {
  async processEscrowTransaction(escrowData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/crowd-funding/escrowTx`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(escrowData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[CrowdFundingApi] Error processing escrow transaction:', error);
      throw error;
    }
  }

  async getCrowdFundingList() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/crowd-funding`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[CrowdFundingApi] Error fetching crowd funding list:', error);
      throw error;
    }
  }

  async getCrowdFundingById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/crowd-funding/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[CrowdFundingApi] Error fetching crowd funding by id:', error);
      throw error;
    }
  }

  async batchCancel(crowdId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/crowd-funding/batchCancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ crowdId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[CrowdFundingApi] Error processing batch cancel:', error);
      throw error;
    }
  }

  async batchFinish(crowdId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/crowd-funding/batchFinish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ crowdId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[CrowdFundingApi] Error processing batch finish:', error);
      throw error;
    }
  }
}

export default new CrowdFundingApiService();