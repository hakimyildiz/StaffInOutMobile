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

export interface ApiTimeLogRequest extends ApiAuthRequest {
  TimeLogID?: Number;
  BreakTimeID?: Number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface TimeLog {
  ID: Number,
  CheckInTime: string,
  CheckOutTime: string,
  TotalHours: Number,
  TimeBreaks: TimeBreak[]
  }

export interface TimeBreak { 
  ID: Number,
  BreakStartTime: string,
  BreakEndTime: string,
  BreakHours: Number
}

