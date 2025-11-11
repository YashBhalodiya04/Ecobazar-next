export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
  id: string;
  isresetpassword: boolean;
}

export interface SendOtpPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  id: string;
  password: string;
  confirmPassword: string;
}

export interface SendOtpAPiResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
  };
  statuscode: number;
}
