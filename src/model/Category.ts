import mongoose, { Types, Document, Schema } from "mongoose";

export interface Category extends Document {
  name: string;
  description: string;
  image: string;
  user: Types.ObjectId;
  active: boolean;
}

const CategorySchema: Schema<Category> = new Schema({
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
  image: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const CategoryModal =
  (mongoose.models.Category as mongoose.Model<Category>) ||
  mongoose.model<Category>("Category", CategorySchema);

export default CategoryModal;
