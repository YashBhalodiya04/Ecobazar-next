import mongoose, { Types, Document, Schema } from "mongoose";

export interface MainSlider extends Document {
  title: string;
  description: string;
  image: string;
  fromDate: Date;
  to: Date;
  createAt: Date;
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
  to: {
    type: Date,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const MainSlider =
  (mongoose.models.MainSlider as mongoose.Model<MainSlider>) ||
  mongoose.model<MainSlider>("MainSlider", MainSliderSchema);

export default MainSlider;
