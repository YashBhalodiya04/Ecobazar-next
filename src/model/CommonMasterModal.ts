import mongoose, { Schema, Document, Types } from "mongoose";

export interface CommonMsater extends Document {
  mastername: string;
  keyid: string;
  keyvalue: string;
  remarks: string;
}

const commonMasterSchema = new Schema<CommonMsater>({
  mastername: { type: String, required: true },
  keyid: { type: String, required: true },
  keyvalue: { type: String, required: true },
  remarks: { type: String, required: false },
});

const CommonMasterModel =
  (mongoose.models.CommonMaster as mongoose.Model<CommonMsater>) ||
  mongoose.model<CommonMsater>("CommonMaster", commonMasterSchema);

export default CommonMasterModel;
