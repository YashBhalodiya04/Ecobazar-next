import { commonResponse } from "@/helper/commonResponbeen";
import { isNullEmpty } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import { ProductGetAllPayload } from "@/interfaces/ProductInterface";
import {
  SignInPayload,
  SignInResponseData,
} from "@/interfaces/SignInInterface";
import dbconnect from "@/lib/dbConnect";
import UserModal from "@/model/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const POSTHandler = async (
  req: NextRequest,
  context: any,
  body: ProductGetAllPayload
) => {
  await dbconnect();
  try {
    const { categoryid, maxprice, minprice, page, pagesize, search, sorting } =
          body;
      
    return commonResponse(true, "", "Product facheed", 200);
  } catch (error) {
    console.error(error);
    return commonResponse(false, "Failed to signin", error);
  }
};

export const POST = withAuth(POSTHandler);
