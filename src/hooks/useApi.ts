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
      //console.log('List:', response.data.data);
      if (response.success && response.data) {
        if(response.data.data) {
          return response.data.data as T;
        }
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
    let staffList: ApiStaff[] | null = null;
    staffList = await handleApiCall(() => apiService.getStaffList());
    //console.log('Staff List:', staffList);
    return staffList;
    //return handleApiCall(() => apiService.getStaffList());
  }, [handleApiCall]);

  const authenticateStaff = useCallback(async (UserID: Number, pinCode: Number=-1): Promise<any> => {
    return handleApiCall(() => apiService.authenticateStaff(UserID, pinCode));
  }, [handleApiCall]);

  const login = useCallback(async (UserID: Number, pinCode: Number=-1): Promise<TimelogEntry | null> => {
    return handleApiCall(() => apiService.login(UserID, pinCode));
  }, [handleApiCall]);

  const logout = useCallback(async (UserID: Number, pinCode: Number=-1): Promise<any> => {
    return handleApiCall(() => apiService.logout(UserID, pinCode));
  }, [handleApiCall]);

  const breakStart = useCallback(async (UserID: Number, timelogID: Number, pinCode: Number=-1): Promise<any> => {
    return handleApiCall(() => apiService.breakStart(UserID, timelogID, pinCode));
  }, [handleApiCall]);

  const breakEnd = useCallback(async (UserID: Number, timelogID: Number, pinCode: Number=-1): Promise<any> => {
    return handleApiCall(() => apiService.breakEnd(UserID, timelogID, pinCode));
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