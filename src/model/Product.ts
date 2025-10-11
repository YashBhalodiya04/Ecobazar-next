import mongoose, { Schema, Document, Types } from "mongoose";

export interface Product extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: Review[];
  user: Types.ObjectId;
}

export interface Review {
  user: string;
  rating: number;
  comment: string;
  date: Date;
}

const ProductSchema: Schema<Product> = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviews: {
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
});
const ProductModal =
  (mongoose.models.Product as mongoose.Model<Product>) ||
  mongoose.model<Product>("Product", ProductSchema);

export default ProductModal;
