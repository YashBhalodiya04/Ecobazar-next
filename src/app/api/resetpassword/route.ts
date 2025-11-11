import { commonResponse } from "@/helper/commonResponbeen";
import { isNullEmpty } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import { ResetPasswordPayload } from "@/interfaces/SIgnUp";
import dbconnect from "@/lib/dbConnect";
import UserModal from "@/model/User";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export const ResetPassword = async (
  req: NextRequest,
  context: ContexInterface,
  body: ResetPasswordPayload
) => {
  await dbconnect();
  try {
    if (!validatePayload(body)) return commonResponse(false, "Invalid payload");

    const { email, id, password, confirmPassword } = body;
    const user = await UserModal.findOne({
      _id: id,
      active: true,
      isverified: true,
      email,
    });
    if (!user) return commonResponse(false, "User not found");

    if (password !== confirmPassword)
      return commonResponse(false, "Password does not match");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (hashedPassword == user.password) {
      return commonResponse(false, "New password is same as old password");
    }

    user.password = hashedPassword;
    await user.save();

    return commonResponse(true, "Password reset successfully");
  } catch (error) {
    console.error("Error resetting password:", error);
    return commonResponse(false, "Failed to reset password", error);
  }
};

export const POST = withAuth(ResetPassword);

const validatePayload = (payload: ResetPasswordPayload): boolean => {
  const { email, id, password, confirmPassword } = payload;
  if (
    isNullEmpty(email) ||
    isNullEmpty(id) ||
    isNullEmpty(password) ||
    isNullEmpty(confirmPassword)
  )
    return false;

  return true;
};
