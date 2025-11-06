import mongoose, { Schema, Document, Types } from "mongoose";

export interface OrderItem {
  product: Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentInfo {
  method: "COD" | "CARD" | "UPI" | "NETBANKING";
  transactionId?: string;
  status: "pending" | "paid" | "failed" | "refunded";
}

export interface Order extends Document {
  user: Types.ObjectId;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  orderStatus:
    | "pending"
    | "confirmed"
    | "packed"
    | "shipped"
    | "delivered"
    | "cancelled";
  totalAmount: number;
  discount: number;
  finalAmount: number;
  tracking?: {
    trackingNumber?: string;
    courierName?: string;
    expectedDeliveryDate?: Date;
  };
}

const OrderSchema: Schema<Order> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        subtotal: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentInfo: {
      method: {
        type: String,
        enum: ["COD", "CARD", "UPI", "NETBANKING"],
        required: true,
      },
      transactionId: { type: String },
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "packed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },

    tracking: {
      trackingNumber: { type: String },
      courierName: { type: String },
      expectedDeliveryDate: { type: Date },
    },
  },
  { timestamps: true }
);

const OrderModel =
  (mongoose.models.Order as mongoose.Model<Order>) ||
  mongoose.model<Order>("Order", OrderSchema);

export default OrderModel;
