import mongoose, { Schema, Document } from "mongoose";
export interface User {
  username: string;
  password: string;
  createAt?: Date;
  email: string;
  isAdmin?: boolean;
  userimage?: string;
  cart?: CartModal[];
  billingAddress?: UserBillingAddress[];
  phone: string;
  active: boolean;
  finalcartvalue?: number;
  isverified?: boolean;
}

export interface CartModal {
  productId: string;
  quantity: number;
  price: number;
}

export interface UserBillingAddress {
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

const UserScheme: Schema<User> = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    createAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: false,
    },
    phone: {
      type: String,
      default: "",
      required: true,
    },
    userimage: {
      type: String,
      default: "",
      required: false,
    },
    active: {
      type: Boolean,
      default: true,
      required: true,
    },
    cart: {
      type: [
        {
          productId: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
        },
      ],
      default: [],
      required: true,
    },
    billingAddress: {
      type: [
        {
          firstName: {
            type: String,
            required: true,
          },
          lastName: {
            type: String,
            required: true,
          },
          address: {
            type: String,
            required: true,
          },
          city: {
            type: String,
            required: true,
          },
          state: {
            type: String,
            required: true,
          },
          zipCode: {
            type: String,
            required: true,
          },
          country: {
            type: String,
            required: true,
          },
          phoneNumber: {
            type: String,
            required: true,
          },
          isPrimary: {
            type: Boolean,
            default: false,
            required: true,
          },
        },
      ],
      default: [],
      required: true,
    },
    isverified: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

UserScheme.virtual("finalcartvalue").get(function () {
  return this?.cart?.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
});

const UserModal =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserScheme);
export default UserModal;
