export interface Staff {
  ID: number;
  Name: string;
}

export interface TimeLogResponse {
  success: boolean;
}

export interface TimeLogRequest {
  UserID: number;
  pin: string;
  datetime: string;
}