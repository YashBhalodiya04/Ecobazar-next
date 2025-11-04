import { commonResponse } from "@/helper/commonResponbeen";
import { isNullEmpty } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface, JWtUserInterface } from "@/interfaces/commonInterace";
import {
  SignInPayload,
  SignInResponseData,
} from "@/interfaces/SignInInterface";
import dbconnect from "@/lib/dbConnect";
import UserModal from "@/model/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const POSTHandler = async (
  req: NextRequest,
  context: ContexInterface,
  body: SignInPayload
) => {
  await dbconnect();
  try {
    const { email, password } = body;
    const validationResponse = validateSignPayload({ email, password });
    if (validationResponse) {
      return commonResponse(false, validationResponse, null, 200);
    }
    const user = await UserModal.findOne({ email, active: true });
    if (!user) {
      return commonResponse(false, "User not found", null, 200);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return commonResponse(false, "Invalid credentials", null, 200);
    }
    const token = jwt.sign(
      {
        id: user._id?.toString(),
        isadmin: user.isAdmin,
      } as JWtUserInterface,
      process.env.JWT_TOKEN as string,
      { expiresIn: "10h" }
    );

    const { ...userData } = user.toObject();

    const responseData: SignInResponseData = {
      username: userData?.username || "",
      isAdmin: Boolean(userData?.isAdmin),
      userimage: userData?.userimage || "",
      _id: userData?._id?.toString() || "",
    };

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 10, // 10 hours
    });

    (await cookies()).set("user", JSON.stringify(responseData), {
      httpOnly: false, //
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 10, // 10 hours
    });

    return commonResponse(true, "", responseData, 200);
  } catch (error) {
    console.error(error);
    return commonResponse(false, "Failed to signin", error);
  }
};

export const POST = withAuth(POSTHandler);

const validateSignPayload = (payload: SignInPayload): string => {
  const { email, password } = payload;
  if (isNullEmpty(email) || isNullEmpty(password)) {
    return "All fields are required";
  }

  return "";
};
