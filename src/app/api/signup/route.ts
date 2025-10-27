import { commonResponse } from "@/helper/commonResponbeen";
import { isNullEmpty } from "@/helper/CommonUtils";
import { SignUpPayload } from "@/interfaces/SIgnUp";
import dbconnect from "@/lib/dbConnect";
import UserModal, { User } from "../../../model/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { withAuth } from "@/helper/withAuth";

export const SignUp = async (req: Request) => {
  await dbconnect();
  try {
    const { name, email, password, confirmPassword, phone }: SignUpPayload =
      await req.json();
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new UserModal<User>({
      username: name,
      email,
      password: hashedPassword,
      phone,
      active: true,
    });

    const Environment = process.env.ENVIRONMENT;
    if (Environment === "PROD") {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Send mail
      const respnse = await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: email, // send to your inbox
        subject: `New message from ${name}`,
        text: name,
      });
    }
    await newUser.save();

    return commonResponse(true, "User created successfully", "", 200);
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
  return "";
};
