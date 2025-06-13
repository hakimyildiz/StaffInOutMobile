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

      const result = await response.json();
      
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
    return this.makeRequest<ApiStaff[]>('/user/staff');
  }

  // Staff Authentication
  async authenticateStaff(userID: string, pinCode: string): Promise<ApiResponse<any>> {
    const data: ApiAuthRequest = {
      UserID: userID,
      PinCode: pinCode,
    };
    return this.makeRequest('/user/staff', 'POST', data);
  }

  // Time Tracking Operations
  async login(userID: string, pinCode: string): Promise<ApiResponse<TimelogEntry>> {
    const data: ApiAuthRequest = {
      UserID: userID,
      PinCode: pinCode,
    };
    return this.makeRequest<TimelogEntry>('/timelog/login', 'POST', data);
  }

  async logout(userID: string, pinCode: string): Promise<ApiResponse<any>> {
    const data: ApiAuthRequest = {
      UserID: userID,
      PinCode: pinCode,
    };
    return this.makeRequest('/timelog/logout', 'POST', data);
  }

  async breakStart(userID: string, pinCode: string, timelogID: string): Promise<ApiResponse<any>> {
    const data: ApiTimelogRequest = {
      UserID: userID,
      PinCode: pinCode,
      timelogID,
    };
    return this.makeRequest('/timelog/breakstart', 'POST', data);
  }

  async breakEnd(userID: string, pinCode: string, timelogID: string): Promise<ApiResponse<any>> {
    const data: ApiTimelogRequest = {
      UserID: userID,
      PinCode: pinCode,
      timelogID,
    };
    return this.makeRequest('/timelog/breakend', 'POST', data);
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