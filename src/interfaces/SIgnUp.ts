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
    id: string
}
