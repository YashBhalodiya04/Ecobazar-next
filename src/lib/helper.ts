import mongoose from "mongoose";

/**
 * Validate a string and convert to Mongoose ObjectId
 * @param idStr - string to convert
 * @returns ObjectId if valid, otherwise null
 */
export function toObjectId(idStr?: string): mongoose.Types.ObjectId | null {
  if (!idStr) return null;
  if (!mongoose.Types.ObjectId.isValid(idStr)) return null;
  return new mongoose.Types.ObjectId(idStr);
}

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};