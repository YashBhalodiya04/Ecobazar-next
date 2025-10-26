import mongoose, { Schema, Document, Types } from "mongoose";

// -----------------------------------------
// Interfaces
// -----------------------------------------

export interface ProductInfoField {
  _id?: Types.ObjectId;
  label: string;
  value: string;
}

export interface ProductInfoSection {
  _id?: Types.ObjectId;
  title: string;
  fields: ProductInfoField[];
}

export interface Offer {
  title: string;
  discountPercent: number;
  validUntil: Date;
  description?: string;
}

export interface Review {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment: string;
  date: Date;
}

export interface ProductImage {
  _id?: Types.ObjectId;
  url: string;
  isMain?: boolean;
}

export interface Product extends Document {
  name: string;
  description: string;
  price: number;
  images: ProductImage[];
  category: string;
  stock: number;
  reviews: Review[];
  user: Types.ObjectId;
  active: boolean;
  averageRating?: number;
  additionalInfo?: ProductInfoSection[];
  offer?: Offer;
}

// -----------------------------------------
// Schema Definition
// -----------------------------------------

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

  // --- Images ---
  images: {
    type: [
      {
        _id: { type: Schema.Types.ObjectId, auto: true },
        url: { type: String, required: true },
        isMain: { type: Boolean, default: false },
      },
    ],
    validate: {
      validator: function (value: any[]) {
        return value.length <= 5;
      },
      message: "A product can have a maximum of 5 images.",
    },
    required: true,
  },

  active: {
    type: Boolean,
    required: true,
    default: true,
  },

  category: {
    type: String,
    required: true,
  },

  stock: {
    type: Number,
    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // --- Reviews ---
  reviews: [
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],

  // --- Additional Info ---
  additionalInfo: [
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      title: { type: String, required: true },
      fields: [
        {
          _id: { type: Schema.Types.ObjectId, auto: true },
          label: { type: String, required: true },
          value: { type: String, required: true },
        },
      ],
    },
  ],

  // --- Offer Section ---
  offer: {
    title: { type: String },
    discountPercent: { type: Number },
    validUntil: { type: Date },
    description: { type: String },
  },
});

// -----------------------------------------
// Virtuals
// -----------------------------------------

ProductSchema.virtual("averageRating").get(function (this: Product) {
  if (!this.reviews || this.reviews.length === 0) return 0;
  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  return parseFloat((total / this.reviews.length).toFixed(1)); // Round to 1 decimal
});

// -----------------------------------------
// Model Export
// -----------------------------------------

const ProductModel =
  (mongoose.models.Product as mongoose.Model<Product>) ||
  mongoose.model<Product>("Product", ProductSchema);

export default ProductModel;
