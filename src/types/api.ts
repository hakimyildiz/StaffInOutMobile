export interface ApiStaff {
  UserID: string;
  Name: string;
  PinCode: string;
  SecurityNumber?: string;
  Status?: string;
}

export interface ApiAuthRequest {
  UserID: string;
  PinCode: string;
}

export interface ApiTimelogRequest extends ApiAuthRequest {
  timelogID?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface TimelogEntry {
  timelogID: string;
  UserID: string;
  loginTime?: string;
  logoutTime?: string;
  breakStartTime?: string;
  breakEndTime?: string;
  status: 'logged-in' | 'on-break' | 'logged-out';
}