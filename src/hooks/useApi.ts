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

  const authenticateStaff = useCallback(async (UserID: Number, pinCode: string): Promise<any> => {
    let PinCode:Number = Number(pinCode);
    if( Number.isNaN(PinCode)) {
      setError('PIN code cannot be empty');
      return null;
    }
    return handleApiCall(() => apiService.authenticateStaff(UserID, PinCode));
  }, [handleApiCall]);

  const CheckIn = useCallback(async (UserID: Number, pinCode: string): Promise<TimelogEntry | null> => {
    let PinCode:Number = Number(pinCode);
    if( Number.isNaN(PinCode)) {
      setError('PIN code cannot be empty');
      return null;
    }
    return handleApiCall(() => apiService.checkin(UserID, PinCode));
  }, [handleApiCall]);

  const CheckOut = useCallback(async (UserID: Number, pinCode: string): Promise<any> => {
    let PinCode:Number = Number(pinCode);
    if( Number.isNaN(PinCode)) {
      setError('PIN code cannot be empty');
      return null;
    }
    return handleApiCall(() => apiService.checkout(UserID, PinCode));
  }, [handleApiCall]);

  const BreakStart = useCallback(async (UserID: Number, timelogID: Number, pinCode: string): Promise<any> => {
    let PinCode:Number = Number(pinCode);
    if( Number.isNaN(PinCode)) {
      setError('PIN code cannot be empty');
      return null;
    }
    return handleApiCall(() => apiService.breakStart(UserID, timelogID, PinCode));
  }, [handleApiCall]);

  const BreakEnd = useCallback(async (UserID: Number, timelogID: Number, pinCode: string): Promise<any> => {
    let PinCode:Number = Number(pinCode);
    if( Number.isNaN(PinCode)) {
      setError('PIN code cannot be empty');
      return null;
    }
    return handleApiCall(() => apiService.breakEnd(UserID, timelogID, PinCode));
  }, [handleApiCall]);

  return {
    loading,
    error,
    getStaffList,
    authenticateStaff,
    CheckIn,
    CheckOut,
    BreakStart,
    BreakEnd,
  };
};