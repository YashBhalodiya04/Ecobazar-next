export interface CommonApiInterface {
  success: boolean;
  message: string;
  data: any;
  status: number;
}

export interface JWtUserInterface {
  id: string;
  email: string;
  isadmin: boolean;
  phone: string;
}

export interface ContexInterface {
  user: JWtUserInterface;
  params: any;
}
