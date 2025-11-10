import { commonResponse } from "@/helper/commonResponbeen";
import { isNullEmpty } from "@/helper/CommonUtils";
import { SignUpPayload } from "@/interfaces/SIgnUp";
import dbconnect from "@/lib/dbConnect";
import UserModal, { User } from "../../../model/User";
import bcrypt from "bcryptjs";
import { withAuth } from "@/helper/withAuth";
import { NextRequest } from "next/server";
import { ContexInterface, DISPOSABLE_DOMAINS } from "@/interfaces/commonInterace";
import { sendEmail } from "@/lib/sendEmail";
import OtpRequestModel from "@/model/OtpRequest";
import { generateOTP } from "@/lib/helper";
import encryptDecryptUtil from "../../../lib/encrypt-decrypt-utils";

export const SignUp = async (
  req: NextRequest,
  context: ContexInterface,
  body: SignUpPayload
) => {
  await dbconnect();
  try {
    const { name, email, password, confirmPassword, phone } = body;
    const validationResponse = validateSignUpPayload({
      name,
      email,
      password,
      confirmPassword,
      phone,
    });
    if (validationResponse) {
      return commonResponse(false, validationResponse, null, 200);
    }
    const user = await UserModal.findOne({ email, active: true });
    if (user) {
      return commonResponse(false, "User already exists", null, 200);
    }
    const Environment = process.env.ENVIRONMENT;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new UserModal<User>({
      username: name,
      email,
      password: hashedPassword,
      phone,
      active: true,
      isverified: Environment === "PROD" ? false : true,
    });

    const otp = generateOTP();

    const otpRequest = new OtpRequestModel({
      user: newUser._id,
      otp: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      active: true,
    });

    await otpRequest.save();

    const encryptedPayload = encryptDecryptUtil.encryptData(
      JSON.stringify({ id: newUser._id, email })
    );
    const encoded = encodeURIComponent(encryptedPayload);

    if (Environment === "PROD") {
      const verificationLink = process.env.FORNTENDURL + encoded;
      const html = `
  <div style="font-family: Arial, sans-serif; padding: 24px;">
    <h2 style="color:#1e293b;">Welcome, ${name || "User"}!</h2>

    <p>Your verification OTP is:</p>
    <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 16px 0; color:#10b981;">
      ${otp}
    </div>

    <p>Or click the button below to verify your account:</p>

    <a href="${verificationLink}"
       style="display:inline-block; margin:24px 0; background:#10b981; color:#fff; padding:12px 22px; text-decoration:none; border-radius:6px; font-weight:600;">
       Verify Account
    </a>

    <p>If the button does not work, copy and paste the link below:</p>
    <p style="color:#0ea5e9;">${verificationLink}</p>

    <p style="margin-top: 30px;">This OTP and link will expire in <strong>10 minutes</strong>.</p>
  </div>
`;

      await sendEmail({
        to: email,
        subject: "Verify Your Account",
        html: html,
      });
    }
    await newUser.save();

    return commonResponse(
      true,
      "Please Verify Your Account. Check Entered Email",
      "",
      200
    );
  } catch (error) {
    console.error(error);
    return commonResponse(false, "Failed to signup", error);
  }
};

export const POST = withAuth(SignUp);

const validateSignUpPayload = (payload: SignUpPayload): string => {
  const { name, email, password, confirmPassword, phone } = payload;

  if (
    isNullEmpty(name) ||
    isNullEmpty(email) ||
    isNullEmpty(password) ||
    isNullEmpty(confirmPassword) ||
    isNullEmpty(phone)
  ) {
    return "All fields are required";
  }

  if (password !== confirmPassword) {
    return "Password and confirm password do not match";
  }

  // ✅ Additional Validation for PROD
  const ENVIRONMENT = process.env.ENVIRONMENT;
  if (ENVIRONMENT === "PROD") {
    const domain = email.split("@")[1]?.toLowerCase();
    if (DISPOSABLE_DOMAINS.includes(domain)) {
      return "Disposable / temporary email addresses are not allowed";
    }
  }

  return "";
};
