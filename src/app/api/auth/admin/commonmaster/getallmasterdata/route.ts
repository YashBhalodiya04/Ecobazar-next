import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import { CommonMasterGetAllPayload } from "@/interfaces/CommonMasterInterface";
import dbconnect from "@/lib/dbConnect";
import CommonMasterModel, { CommonMsater } from "@/model/CommonMasterModal";
import { NextRequest } from "next/server";
import { FilterQuery } from "mongoose";
import { isNullEmpty } from "../../../../../../helper/CommonUtils";

export const GetAllMasterData = async (
  req: NextRequest,
  context: ContexInterface,
  body: CommonMasterGetAllPayload
) => {
  await dbconnect();
  try {
    if (!context?.user?.isadmin) {
      return commonResponse(false, "You are not authorized", "", 403);
    }

    if (!validatePayload(body)) {
      return commonResponse(false, "Parameter is missing", "", 200);
    }

    const { search = "", page = 1, pagesize = 10 } = body;

    const query: FilterQuery<CommonMsater> = { active: true };

    if (!isNullEmpty(search.trim())) {
      query.$or = [
        { mastername: { $regex: search, $options: "i" } },
        { remarks: { $regex: search, $options: "i" } },
        { "subdata.keyid": { $regex: search, $options: "i" } },
        { "subdata.keyvalue": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(pagesize);
    const totalFilteredCount = await CommonMasterModel.countDocuments(query);
    const totalCount = await CommonMasterModel.countDocuments({ active: true });

    const masterDataList = await CommonMasterModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$mastername",
          masterid: { $first: "$_id" },
          mastername: { $first: "$mastername" },
          remarks: { $first: "$remarks" },
          subdata: { $first: "$subdata" },
        },
      },
      { $sort: { mastername: 1 } },
      { $skip: skip },
      { $limit: Number(pagesize) },
    ]);

    const FinalData = {
      data: masterDataList,
      totalFilteredCount,
      totalCount,
    };

    return commonResponse(true, "", FinalData);
  } catch (error) {
    console.error("Get All Master Data Error:", error);
    return commonResponse(false, "Failed to get all master data", error, 500);
  }
};

export const POST = withAuth(GetAllMasterData);

const validatePayload = (body: CommonMasterGetAllPayload): boolean => {
  const { page, pagesize } = body;
  return Boolean(page && pagesize);
};
