import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";

export const GetAllMasterData = async (
  req: NextRequest,
  context: ContexInterface,
  body: any
) => {
  await dbconnect();
  try {
    return commonResponse(true, "Successfully get all master data");
  } catch (error) {
    console.error("Get All Master Data Error:", error);
    return commonResponse(false, "Failed to get all master data", error, 500);
  }
};

export const POST = withAuth(GetAllMasterData);
