import mongoose, { Schema, Document, Types } from "mongoose";

export interface CommonMsater extends Document {
  mastername: string;
  remarks: string;
  subdata: CommonMasterSubData[];
  active: boolean;
}

export interface CommonMasterSubData {
  keyid: string;
  keyvalue: string;
}

const SubDataSchema = new Schema<CommonMasterSubData>({
  keyid: { type: String, required: true },
  keyvalue: { type: String, required: true },
});

const commonMasterSchema = new Schema<CommonMsater>(
  {
    mastername: { type: String, required: true },
    remarks: { type: String, default: "" },
    subdata: [SubDataSchema],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CommonMasterModel =
  (mongoose.models.CommonMaster as mongoose.Model<CommonMsater>) ||
  mongoose.model<CommonMsater>("CommonMaster", commonMasterSchema);

export default CommonMasterModel;
