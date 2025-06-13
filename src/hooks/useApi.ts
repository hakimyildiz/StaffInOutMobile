import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import type { ApiStaff, ApiResponse, TimelogEntry } from '../types/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = useCallback(async <T>(
    apiCall: () => Promise<ApiResponse<T>>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error || 'API call failed');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStaffList = useCallback(async (): Promise<ApiStaff[] | null> => {
    return handleApiCall(() => apiService.getStaffList());
  }, [handleApiCall]);

  const authenticateStaff = useCallback(async (userID: string, pinCode: string): Promise<any> => {
    return handleApiCall(() => apiService.authenticateStaff(userID, pinCode));
  }, [handleApiCall]);

  const login = useCallback(async (userID: string, pinCode: string): Promise<TimelogEntry | null> => {
    return handleApiCall(() => apiService.login(userID, pinCode));
  }, [handleApiCall]);

  const logout = useCallback(async (userID: string, pinCode: string): Promise<any> => {
    return handleApiCall(() => apiService.logout(userID, pinCode));
  }, [handleApiCall]);

  const breakStart = useCallback(async (userID: string, pinCode: string, timelogID: string): Promise<any> => {
    return handleApiCall(() => apiService.breakStart(userID, pinCode, timelogID));
  }, [handleApiCall]);

  const breakEnd = useCallback(async (userID: string, pinCode: string, timelogID: string): Promise<any> => {
    return handleApiCall(() => apiService.breakEnd(userID, pinCode, timelogID));
  }, [handleApiCall]);

  return {
    loading,
    error,
    getStaffList,
    authenticateStaff,
    login,
    logout,
    breakStart,
    breakEnd,
  };
};