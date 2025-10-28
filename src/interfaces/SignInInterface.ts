export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponseAPIData {
  success: true;
  message: string;
  data: SignInResponseData;
  statuscode: number;
}

export interface SignInResponseData {
  username: string;
  email: string;
  isAdmin: boolean;
  phone: string;
  userimage: string;
  _id: string;
}
