import { CommonDropdownOptions } from "./commonInterace";

export interface OrderGetAllPayload {
  search: string;
  page: number;
  pagesize: number;
  status: string;
}

export interface OrderListItem {
  _id: string;
  username: string;
  useremail: string;
  phone: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus:
    | "pending"
    | "confirmed"
    | "packed"
    | "shipped"
    | "delivered"
    | "cancelled";
  totalAmount: number;
  finalAmount: number;
  trackingNumber?: string;
  createdAt: string;
}

export interface OrderListResponseData {
  data: OrderListItem[];
  recordsFiltered: number;
  recordsTotal: number;
}

export interface OrderListApiResponse {
  success: boolean;
  message: string;
  data: OrderListResponseData;
  statuscode: number;
}

export const orderStatusColors: Record<string, string> = {
  pending: "orange",
  confirmed: "blue",
  packed: "cyan",
  shipped: "purple",
  delivered: "green",
  cancelled: "red",
};

export const paymentStatusColors: Record<string, string> = {
  pending: "orange",
  paid: "green",
  failed: "red",
  refunded: "blue",
};

export interface OrderDetailResponse {
  success: boolean;
  message: string;
  data: OrderDetailData;
  statuscode: number;
}

export interface OrderDetailData {
  _id: string;
  items: OrderDetailItem[];
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  orderStatus: {
    keyid: string;
    keyvalue: string;
  };
  username: string;
  paymentMethod: {
    keyid: string;
    keyvalue: string;
  };
  paymentStatus: {
    keyid: string;
    keyvalue: string;
  };
}

export interface OrderDetailItem {
  product: string;
  quantity: number;
  price: number;
  productName: string;
  mainImage: string;
  categoryName: string;
  stock: number;
  productstatus: {
    keyid: string;
    keyvalue: string;
  };
  rejectionReason: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentInfo {
  method: string;
  status: string;
}

export interface OrderStatusCangePayload {
  orderid: string;
  status:
    | "pending"
    | "confirmed"
    | "packed"
    | "shipped"
    | "delivered"
    | "cancelled";
  itemdata: OrderStatusChangeItemData[];
}

export interface OrderStatusChangeItemData {
  productid: string;
  productstatus:
    | "pending"
    | "confirmed"
    | "packed"
    | "shipped"
    | "delivered"
    | "cancelled";
  rejectionReason: string;
}

export interface CommondropdownDataAPiresponse {
  success: boolean;
  message: string;
  data: CommondropdownData;
  statuscode: number;
}

export interface CommondropdownData {
  OrderStatus: CommonDropdownOptions[];
  PaymentMethods: CommonDropdownOptions[];
  PaymentStatus: CommonDropdownOptions[];
}
