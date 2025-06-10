export interface Staff {
  ID: number;
  FirstName: string;
  LastName: string;
}

export interface TimeLogRequest {
  UserID: number;
  PinCode: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
}

export interface StaffResponse {
  data: Staff[];
  success: boolean;
  message?: string;
  count?: number;
}