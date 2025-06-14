export interface ApiStaff {
  UserID: Number;
  FirstName: string;
  LastName: string;
  WorkStatus?: string;
  BreakStatus?: string;
}

export interface ApiAuthRequest {
  UserID: Number;
  PinCode: Number;
}

export interface ApiTimelogRequest extends ApiAuthRequest {
  timelogID?: Number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface TimelogEntry {
  ID: Number;
  UserID: Number;
  loginTime?: string;
  logoutTime?: string;
  breakStartTime?: string;
  breakEndTime?: string;
  status: 'logged-in' | 'on-break' | 'logged-out';
}