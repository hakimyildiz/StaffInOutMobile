import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import type { ApiStaff, ApiResponse, TimelogEntry,ApiAuthRequest } from '../types/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [ApiLogin, setApiLogin] = useState<ApiAuthRequest>({
      UserID: 0,
      PinCode: 0,
    });

  const handleApiCall = useCallback(async <T>(
    apiCall: () => Promise<ApiResponse<T>>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      //console.log('List:', response.data.data);
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
    let staffList: ApiStaff[] | null = null;
    staffList = await handleApiCall(() => apiService.getStaffList());
    //console.log('Staff List:', staffList);
    return staffList;
    //return handleApiCall(() => apiService.getStaffList());
  }, [handleApiCall]);

  const Login = useCallback(async (UserID: Number, _pinCode: string): Promise<any> => {
    let pinCode:Number = Number(_pinCode);
    if( Number.isNaN(pinCode)) {
      setError('PIN code cannot be empty');
      return null;
    }
    let apiLogin: ApiAuthRequest = {
      UserID: UserID,
      PinCode: pinCode,
    };
    setApiLogin(apiLogin);
    return handleApiCall(() => apiService.authenticateStaff(UserID, pinCode));
  }, [handleApiCall]);

  const CheckIn = useCallback(async (): Promise<TimelogEntry | null> => {
    console.log('Login:', ApiLogin);
    return handleApiCall(() => apiService.checkin(ApiLogin.UserID, ApiLogin.PinCode));
  }, [handleApiCall]);

  const CheckOut = useCallback(async (): Promise<any> => {    
    return handleApiCall(() => apiService.checkout(ApiLogin.UserID, ApiLogin.PinCode));
  }, [handleApiCall]);

  const BreakStart = useCallback(async (timelogID: Number): Promise<any> => {
    
    return handleApiCall(() => apiService.breakStart(ApiLogin.UserID, ApiLogin.PinCode, timelogID));
  }, [handleApiCall]);

  const BreakEnd = useCallback(async (timelogID: Number): Promise<any> => {
    return handleApiCall(() => apiService.breakEnd(ApiLogin.UserID, ApiLogin.PinCode, timelogID));
  }, [handleApiCall]);

  return {
    loading,
    error,
    getStaffList,
    Login,
    CheckIn,
    CheckOut,
    BreakStart,
    BreakEnd,
  };
};