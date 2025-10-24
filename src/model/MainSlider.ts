import mongoose, { Types, Document, Schema } from "mongoose";

export interface MainSlider extends Document {
  title: string;
  description: string;
  image: string;
  fromDate: Date;
  toDate: Date;
  createAt: Date;
  user: Types.ObjectId;
  active: boolean;
}

const MainSliderSchema: Schema<MainSlider> = new Schema({
  title: {
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
  fromDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  toDate: {
    type: Date,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const MainSliderModal =
  (mongoose.models.MainSlider as mongoose.Model<MainSlider>) ||
  mongoose.model<MainSlider>("MainSlider", MainSliderSchema);

export default MainSliderModal;
