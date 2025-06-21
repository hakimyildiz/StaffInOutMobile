import { CapacitorHttp } from '@capacitor/core';
import type { HttpResponse } from '@capacitor/core';

import type { ApiStaff, ApiAuthRequest, ApiTimeLogRequest, ApiResponse, TimeLog,TimeBreak } from '../types/api';

class ApiService {
  public getBaseUrl(): string {
    return localStorage.getItem('apiBaseUrl') || 'http://localhost:5000';
  }

  private async makeRequest<T>(
    endpoint: string, 
    method: 'GET' | 'POST' = 'GET', 
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const baseUrl = this.getBaseUrl();
      const url = `${baseUrl}${endpoint}`;
      
      // Configure CapacitorHttp options
      const options = {
        url,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        //data: null, // Will be set for POST requests
        // Note: CapacitorHttp doesn't support 'credentials' or 'cache' directly
        // You'll need to handle authentication differently (see below)
      };

      // Add data for POST requests
      if (data && method === 'POST') {
        options.data = data; // No need to stringify - CapacitorHttp handles this
      }

      let response: HttpResponse;

      // Make the request based on method
      if (method === 'GET') {
        response = await CapacitorHttp.get(options);
      } else if (method === 'POST') {
        response = await CapacitorHttp.post(options);
      } else {
        throw new Error(`Unsupported method: ${method}`);
      }
      
      // Check if request was successful (status 200-299)
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle the response data
      let result = response.data;
      
      if (result?.data) {
        //console.log('API Response1:', result);
        return result as ApiResponse<T>;
      }
      
      //console.log('API Response2:', result);
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
    //console.log('API Response:', result);
    return result;
  }

  
  // Staff Login
  async Login(userID: Number, pinCode: Number): Promise<ApiResponse<any>> {
    const data: ApiAuthRequest = {
      UserID: userID,
      PinCode: pinCode,
    };
    let result = await this.makeRequest<any>('/user/login', 'POST', data);
    console.log('API Response:', result);
    return result;
  } 

  // Staff Authentication
  async authenticateStaff(userID: Number, pinCode: Number): Promise<ApiResponse<any>> {
    const data: ApiAuthRequest = {
      UserID: userID,
      PinCode: pinCode,
    };
    let result =  await this.makeRequest('/timelog/staff', 'POST', data);    
    console.log('API Response:', result);
    return result;
  } 


  // Time Tracking Operations
  async checkin(userID: Number, pinCode: Number): Promise<ApiResponse<any>> {
    const data: ApiAuthRequest = {
      UserID: userID,
      PinCode: pinCode,
    };
    return await this.makeRequest('/timelog/checkin', 'POST', data);
  }

  async checkout(userID: Number, pinCode: Number, timelogID: Number): Promise<ApiResponse<any>> {
    const data: ApiTimeLogRequest = {
      UserID: userID,
      PinCode: pinCode,
      TimeLogID:timelogID
    };
    return await this.makeRequest('/timelog/checkout', 'POST', data);
  }

  async breakStart(userID: Number, pinCode: Number, timelogID: Number): Promise<ApiResponse<any>> {
    const data: ApiTimeLogRequest = {
      UserID: userID,
      PinCode: pinCode,
      TimeLogID:timelogID,
    };
    return await this.makeRequest('/timelog/breakstart', 'POST', data);
  }

  async breakEnd(userID: Number, pinCode: Number, timelogID: Number,breakTimeID:Number): Promise<ApiResponse<any>> {
    const data: ApiTimeLogRequest = {
      UserID: userID,
      PinCode: pinCode,
      TimeLogID:timelogID,
      BreakTimeID:breakTimeID,
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