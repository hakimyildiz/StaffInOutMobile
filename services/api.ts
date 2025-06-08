import { Staff, TimeLogRequest, ApiResponse, StaffResponse } from '@/types/api';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.example.com';

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Network error: ${error.message}`);
      }
      throw new Error('Unknown network error occurred');
    }
  }

  async getStaffList(): Promise<Staff[]> {
    try {
      const response = await this.makeRequest<StaffResponse>('/api/user/staff/');
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch staff list');
    } catch (error) {
      throw error;
    }
  }

  async checkIn(request: TimeLogRequest): Promise<ApiResponse> {
    try {
      const response = await this.makeRequest<ApiResponse>('/api/timelog/pinon', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async checkOut(request: TimeLogRequest): Promise<ApiResponse> {
    try {
      const response = await this.makeRequest<ApiResponse>('/api/timelog/pinout', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const apiService = new ApiService();