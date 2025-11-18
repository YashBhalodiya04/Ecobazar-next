import { commonResponse } from "@/helper/commonResponbeen";
import { isNullEmpty } from "@/helper/CommonUtils";
import {
  CommonApiInterface,
  CommonDeletePayloadInterface,
  ContexInterface,
} from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import { toObjectId } from "@/lib/helper";
import CommonMasterModel from "@/model/CommonMasterModal";
import { NextRequest } from "next/server";

export const DeleteMasterData = async (
  req: NextRequest,
  context: ContexInterface,
  body: CommonDeletePayloadInterface
) => {
  await dbconnect();
  try {
    if (!context?.user?.isadmin) {
      return commonResponse(false, "You are not authorized", "", 403);
    }
    const { id } = body;
    if (isNullEmpty(id)) {
      return commonResponse(false, "ID is required");
    }

    const isExist = await CommonMasterModel.findOne({
      _id: toObjectId(id),
      active: true,
    });
    if (!isExist) {
      return commonResponse(false, "Data not found");
    }
    await CommonMasterModel.updateOne(
      { _id: toObjectId(id) },
      { active: false }
    );
    return commonResponse(true, "Master deleted successfully");
  } catch (error) {
    console.error("Get All Master Data Error:", error);
    return commonResponse(false, "Failed to get all master data", error, 500);
  }
};
