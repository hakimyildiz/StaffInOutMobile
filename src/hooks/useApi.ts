import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import type { ApiStaff, ApiResponse, TimeLog,TimeBreak,ApiAuthRequest } from '../types/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setApiLogin = (UserID:Number= 0, PinCode:Number= 0)=> {
      localStorage.setItem('UserID', UserID.toString());
      localStorage.setItem('PinCode', PinCode.toString());
  }
  
  const getApiLogin = <ApiAuthRequest>()=> {   
      let UserID = Number(localStorage.getItem('UserID'));
      let PinCode = Number(localStorage.getItem('PinCode'));
      return {UserID: UserID,PinCode:PinCode};
  }
  const clearApiLogin = ()=> {
      localStorage.removeItem('UserID');
      localStorage.removeItem('PinCode');
  }




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

  const Login = useCallback(async (userID: Number, _pinCode: string): Promise<any> => {
    let pinCode:Number = Number(_pinCode);
    if( Number.isNaN(pinCode)) {
      setError('PIN code cannot be empty');
      return null;
    }
    setApiLogin(userID,pinCode);
    return handleApiCall(() => apiService.authenticateStaff(userID, pinCode));
    //return handleApiCall(() => apiService.Login(userID, pinCode));
  }, [handleApiCall]);

/*

   const getAuthenticatedStaff = useCallback(async (): Promise<any> => {
    let ApiLogin = getApiLogin();
    return handleApiCall(() => apiService.authenticateStaff(ApiLogin.UserID, ApiLogin.PinCode));
  }, [handleApiCall]);

*/

  const CheckIn = useCallback(async (): Promise<any> => {
    let ApiLogin = getApiLogin();
    //console.log('Login:', ApiLogin);
    return handleApiCall(() => apiService.checkin(ApiLogin.UserID, ApiLogin.PinCode));
  }, [handleApiCall]);

  const CheckOut = useCallback(async (timelogID:Number): Promise<any> => {    
    let ApiLogin = getApiLogin();
    return handleApiCall(() => apiService.checkout(ApiLogin.UserID, ApiLogin.PinCode, timelogID));
  }, [handleApiCall]);

  const BreakStart = useCallback(async (timelogID: Number): Promise<any> => {
    let ApiLogin = getApiLogin();    
    return handleApiCall(() => apiService.breakStart(ApiLogin.UserID, ApiLogin.PinCode, timelogID));
  }, [handleApiCall]);

  const BreakEnd = useCallback(async (timelogID: Number, breakTimeID:Number): Promise<any> => {
    let ApiLogin = getApiLogin();
    return handleApiCall(() => apiService.breakEnd(ApiLogin.UserID, ApiLogin.PinCode, timelogID, breakTimeID));
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
    clearApiLogin
  };
};