import { commonResponse } from "@/helper/commonResponbeen";
import { isNullEmpty } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import {
  ContactEmailPayload,
  ContexInterface,
} from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export const ContactUsSendEmail = async (
  req: NextRequest,
  context: ContexInterface,
  body: ContactEmailPayload
) => {
  await dbconnect();
  try {
    const { email, message } = body;
    const error = validateContactUsPayload({ email, message });
    if (error) {
      return commonResponse(false, error, "", 400);
    }
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
        from: `"${email}" <${email}>`,
        to: email, // send to your inbox
        subject: `New message from ${email}`,
        text: message,
      });
    }

    return commonResponse(true, "Thank you for your message", "", 200);
  } catch (error) {
    console.error(error);
    return commonResponse(false, "Failed to send email", error);
  }
};

const validateContactUsPayload = (payload: ContactEmailPayload): string => {
  const { email, message } = payload;
  if (isNullEmpty(email) || isNullEmpty(message)) {
    return "All fields are required";
  }
  return "";
};

export const POST = withAuth(ContactUsSendEmail);
