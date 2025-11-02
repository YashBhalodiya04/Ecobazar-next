export interface AddToCartPayload {
  productid: string;
  quantity: number;
  action: "add" | "remove";
  isfromproductlist: boolean;
}
