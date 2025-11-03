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
