import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";

export const SaveMasterData = async (
  req: NextRequest,
  context: ContexInterface,
  body: any
) => {
  await dbconnect();
  try {
    return commonResponse(true, "Successfully save master data");
  } catch (error) {
    console.error("Save Master Data Error:", error);
    return commonResponse(false, "Failed to save master data", error, 500);
  }
};

export const POST = withAuth(SaveMasterData);
