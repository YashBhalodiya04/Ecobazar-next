import mongoose, { Schema, Document, Types } from "mongoose";

export interface OrderItem {
  product: Types.ObjectId;
  name: string;
  quantity: number;
  subtotal: number;
  orderStatus: string;
  rejectionReason?: string;
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
  method: string;
  transactionId?: string;
  status: string;
}

export interface Order extends Document {
  user: Types.ObjectId;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  orderStatus: string;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  tracking?: {
    trackingNumber?: string;
    courierName?: string;
    expectedDeliveryDate?: Date;
  };
  active: boolean;
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
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        subtotal: { type: Number, required: true },
        itemStatus: {
          type: String,
          required: true,
          default: "0",
        },
        rejectionReason: { type: String },
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
        required: true,
        default: '1'
      },
      transactionId: { type: String },
      status: {
        type: String,
        require: true,
        default: "0",
      },
    },
    orderStatus: {
      type: String,
      require: true,
      default: "0",
    },

    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },

    tracking: {
      trackingNumber: { type: String },
      courierName: { type: String },
      expectedDeliveryDate: { type: Date },
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const OrderModel =
  (mongoose.models.Order as mongoose.Model<Order>) ||
  mongoose.model<Order>("Order", OrderSchema);

export default OrderModel;
