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

export interface TimeLog {
  checkIn: string;
  checkOut?: string;
  staffName?: string;
  duration?: string;
  Action: 'checkin' | 'checkout';
  Timestamp: string;
}

export interface TimeLogResponse {
  data: TimeLog[];
  success: boolean;
  message?: string;
}