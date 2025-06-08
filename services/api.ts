import { Staff, TimeLogRequest, TimeLogResponse } from '@/types/api';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const apiService = {
  async getStaff(): Promise<Staff[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/staff/`);
      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  },

  async clockIn(data: TimeLogRequest): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/timelog/pinon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to clock in');
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error clocking in:', error);
      throw error;
    }
  },

  async clockOut(data: TimeLogRequest): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/timelog/pinout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to clock out');
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error clocking out:', error);
      throw error;
    }
  },
};