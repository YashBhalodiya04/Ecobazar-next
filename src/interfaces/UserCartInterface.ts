export interface AddToCartPayload {
  productid: string;
  quantity: number;
  action: "add" | "remove";
  isfromproductlist: boolean;
}

export interface CartProduct {
  productId: string;
  name: string;
  image: string;
  price: number;
  offerPrice?: number | null; // null if no offer or expired
  quantity: number;
  finalPrice: number;
}

export interface CartData {
  cartdata: CartProduct[];
  finalcartvalue: number;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data: CartData;
  statuscode: number;
}

export interface UserProfileAPiResponse {
  success: boolean;
  message: string;
  data: UserProfile;
  statuscode: number;
}

export interface UserProfile {
  username: string;
  email: string;
  phone: string;
  userimage: string;
  billingAddress: BillingAddress[];
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
  isPrimary: boolean;
}
