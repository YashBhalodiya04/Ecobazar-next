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

