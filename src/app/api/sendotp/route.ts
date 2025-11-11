import { commonResponse } from "@/helper/commonResponbeen";
import { isNullEmpty } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import { SendOtpPayload } from "@/interfaces/SIgnUp";
import dbconnect from "@/lib/dbConnect";
import { generateOTP } from "@/lib/helper";
import { sendEmail } from "@/lib/sendEmail";
import OtpRequestModel from "@/model/OtpRequest";
import UserModal from "@/model/User";
import { NextRequest } from "next/server";

export const SendOtp = async (
  req: NextRequest,
  context: ContexInterface,
  body: SendOtpPayload
) => {
  await dbconnect();
  try {
    if (!validatePayload(body)) return commonResponse(false, "Invalid payload");
    const { email } = body;
    const user = await UserModal.findOne({ email, active: true });

    if (!user) return commonResponse(false, "User not found");

    if (!user.isverified) return commonResponse(false, "User Not verified");

    const hasOtpalreadyExsit = await OtpRequestModel.findOne({
      user: user._id,
      active: true,
      expiresAt: { $gt: new Date() },
    });
    const responsebody = {
      email: user.email,
      id: user._id?.toString(),
    };

    if (hasOtpalreadyExsit) return commonResponse(true, "OTP already sent", responsebody);

    const otp = generateOTP();

    const otpRequest = new OtpRequestModel({
      user: user._id,
      otp: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      active: true,
    });

    await otpRequest.save();

    const Environment = process.env.ENVIRONMENT;
    if (Environment === "PROD") {
      const html = `
  <div style="font-family: Arial, sans-serif; padding: 24px;">
    <h2 style="color:#1e293b;">Password Reset Request</h2>

    <p>Hello, ${user.username || "User"}.</p>

    <p>We received a request to reset your password. Use the OTP below to proceed:</p>

    <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 16px 0; color:#ef4444;">
      ${otp}
    </div>

    <p>Enter this OTP in the password reset form to continue.</p>

    <p style="margin-top: 30px;">This OTP will expire in <strong>10 minutes</strong>.</p>

    <p>If you did not request a password reset, please ignore this email.</p>
  </div>
`;

      await sendEmail({
        to: email,
        subject: "Verify Your Account",
        html: html,
      });
    }

    return commonResponse(true, "OTP sent successfully", responsebody);
  } catch (error) {
    console.error("Error sending OTP:", error);
    return commonResponse(false, "Failed to send OTP", error);
  }
};

export const POST = withAuth(SendOtp);

const validatePayload = (payload: SendOtpPayload): boolean => {
  const { email } = payload;
  if (isNullEmpty(email)) return false;

  return true;
};
