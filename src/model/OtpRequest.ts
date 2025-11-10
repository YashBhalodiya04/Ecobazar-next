import mongoose, { Schema, Document, Types } from "mongoose";

export interface OtpRequest extends Document {
  user: Types.ObjectId;
  otp: string;
  expiresAt: Date;
  active: boolean;
}

const otpRequestSchema = new Schema<OtpRequest>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  active: { type: Boolean, default: true },
});

const OtpRequestModel =
  (mongoose.models.OtpRequest as mongoose.Model<OtpRequest>) ||
  mongoose.model<OtpRequest>("OtpRequest", otpRequestSchema);

export default OtpRequestModel;