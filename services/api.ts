import { Staff, TimeLogRequest, ApiResponse, StaffResponse, TimeLog, TimeLogResponse } from '@/types/api';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://api.piwick.com';

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

  async getRecentTimeLogs(): Promise<TimeLog[]> {
    try {
      // Mock data for demonstration - replace with actual API call
      const mockLogs: TimeLog[] = [
        {
          checkIn: '2024-01-15T09:00:00Z',
          checkOut: '2024-01-15T17:30:00Z',
          Action: 'checkout',
          Timestamp: '2024-01-15T17:30:00Z',
        },
        {
          checkIn: '2024-01-14T08:45:00Z',
          checkOut: '2024-01-14T17:15:00Z',
          Action: 'checkout',
          Timestamp: '2024-01-14T17:15:00Z',
        },
        {
          checkIn: '2024-01-13T09:15:00Z',
          checkOut: '2024-01-13T17:45:00Z',
          Action: 'checkout',
          Timestamp: '2024-01-13T17:45:00Z',
        },
        {
          checkIn: '2024-01-12T08:30:00Z',
          checkOut: '2024-01-12T17:00:00Z',
          Action: 'checkout',
          Timestamp: '2024-01-12T17:00:00Z',
        },
        {
          checkIn: '2024-01-11T09:00:00Z',
          // No checkout - still in progress
          Action: 'checkin',
          Timestamp: '2024-01-11T09:00:00Z',
        },
      ];

      return mockLogs;

      // Uncomment and modify this when you have the actual API endpoint
      // const response = await this.makeRequest<TimeLogResponse>('/api/timelog/recent');
      // if (response.success && response.data) {
      //   return response.data;
      // }
      // throw new Error(response.message || 'Failed to fetch recent time logs');
    } catch (error) {
      // Return empty array on error to prevent breaking the UI
      return [];
    }
  }
}

export const apiService = new ApiService();