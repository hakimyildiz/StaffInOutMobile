export interface Staff {
  id: number;
  name: string;
}

export interface TimeLogRequest {
  UserID: number;
  pin: string;
  datetime: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
}

export interface StaffResponse {
  data: Staff[];
  success: boolean;
  message?: string;
}