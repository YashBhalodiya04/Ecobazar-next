import { commonResponse } from "@/helper/commonResponbeen";
import { isNullEmpty } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import { VerifyOtpPayload } from "@/interfaces/SIgnUp";
import dbconnect from "@/lib/dbConnect";
import OtpRequestModel from "@/model/OtpRequest";
import UserModal from "@/model/User";
import { NextRequest } from "next/server";

export const VerifyOtp = async (
  req: NextRequest,
  context: ContexInterface,
  body: VerifyOtpPayload
) => {
  await dbconnect();
  try {
    if (!validatePayload(body)) {
      return commonResponse(false, "Invalid payload");
    }
    const isProd = process.env.ENVIRONMENT === "PROD";
    const { email, otp, id, isresetpassword = false } = body;
    const user = await UserModal.findOne({ email, _id: id });
    if (!user) {
      return commonResponse(false, "User not found");
    }
    if (isresetpassword) {
      if (!user.isverified) {
        return commonResponse(false, "User not verified");
      }
    } else {
      if (user.isverified) {
        return commonResponse(false, "User already verified");
      }
    }

    const currentotp = await OtpRequestModel.findOne({
      user: user?._id,
      active: true,
    });
    if (!currentotp) {
      return commonResponse(false, "OTP not found");
    }

    if (currentotp.expiresAt < new Date()) {
      currentotp.active = false;
      await currentotp.save();

      return commonResponse(false, "OTP has expired");
    }

    if (currentotp.otp !== otp && isProd) {
      return commonResponse(false, "Invalid OTP");
    }
    if (!isresetpassword) {
      user.isverified = true;
      await user.save();
      return commonResponse(true, "OTP verified successfully");
    }
    return commonResponse(true, "OTP verified successfully");
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return commonResponse(false, "Failed to verify OTP", error);
  }
};

const validatePayload = (payload: VerifyOtpPayload): boolean => {
  const { email, otp } = payload;
  if (isNullEmpty(email) || isNullEmpty(otp)) return false;

  return true;
};

export const POST = withAuth(VerifyOtp);
