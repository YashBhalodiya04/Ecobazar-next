import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";

export const GetProductDetail = async (
  req: NextRequest,
  context: ContexInterface,
  body: any
) => {
  await dbconnect();
  try {
    return commonResponse(true, "", "", 200);
  } catch (error) {
    console.error("Error fetching products:", error);
    return commonResponse(false, "Failed to fetch category list", error, 500);
  }
};

export const POST = withAuth(GetProductDetail);
