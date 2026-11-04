// API Error Types
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

// Axios Error Type Helper
export interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
    status?: number;
  };
  message?: string;
}

// OTP Response Types
export interface OtpSendResponse {
  success: boolean;
  message: string;
  expiryMinutes: number;
}

export interface OtpVerifyResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  token?: string;
}

// Notification Preference Response
export interface NotificationPreferenceResponse {
  success: boolean;
  message: string;
  data?: any;
}
