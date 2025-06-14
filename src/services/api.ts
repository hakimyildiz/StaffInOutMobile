import type { ApiStaff, ApiAuthRequest, ApiTimelogRequest, ApiResponse, TimelogEntry } from '../types/api';

class ApiService {
  private getBaseUrl(): string {
    return localStorage.getItem('apiBaseUrl') || 'http://localhost:5000/api';
  }

  private async makeRequest<T>(
    endpoint: string, 
    method: 'GET' | 'POST' = 'GET', 
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const baseUrl = this.getBaseUrl();
      const url = `${baseUrl}${endpoint}`;
      
      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data && method === 'POST') {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let result = await response.json();
      if(result?.data) {
        //console.log('API Response:', result.data);
         return result as ApiResponse<T>;
      }
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Staff List Retrieval
  async getStaffList(): Promise<ApiResponse<ApiStaff[]>> {
    let result = this.makeRequest<ApiStaff[]>('/user/staff');
    console.log('API Response:', result);
    return result;
  }

  // Staff Authentication
  async authenticateStaff(userID: Number, pinCode: Number): Promise<ApiResponse<any>> {
    const data: ApiAuthRequest = {
      UserID: userID,
      PinCode: pinCode,
    };
    return await this.makeRequest('/timelog/staff', 'POST', data);
  } 


  // Time Tracking Operations
  async checkin(userID: Number, pinCode: Number): Promise<ApiResponse<TimelogEntry>> {
    const data: ApiAuthRequest = {
      UserID: userID,
      PinCode: pinCode,
    };
    return await this.makeRequest('/timelog/checkin', 'POST', data);
  }

  async checkout(userID: Number, pinCode: Number): Promise<ApiResponse<any>> {
    const data: ApiAuthRequest = {
      UserID: userID,
      PinCode: pinCode,
    };
    return await this.makeRequest('/timelog/checkout', 'POST', data);
  }

  async breakStart(userID: Number, pinCode: Number, timelogID: Number): Promise<ApiResponse<any>> {
    const data: ApiTimelogRequest = {
      UserID: userID,
      PinCode: pinCode,
      timelogID,
    };
    return await this.makeRequest('/timelog/breakstart', 'POST', data);
  }

  async breakEnd(userID: Number, pinCode: Number, timelogID: Number): Promise<ApiResponse<any>> {
    const data: ApiTimelogRequest = {
      UserID: userID,
      PinCode: pinCode,
      timelogID,
    };
    return await this.makeRequest('/timelog/breakend', 'POST', data);
  }

  // Utility methods
  setBaseUrl(url: string): void {
    localStorage.setItem('apiBaseUrl', url);
  }

  getStoredBaseUrl(): string {
    return this.getBaseUrl();
  }
}

export const apiService = new ApiService();