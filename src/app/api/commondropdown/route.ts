import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import {
  CommonDropdownPayload,
  ContexInterface,
} from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import CommonMasterModel, {
  CommonMasterSubData,
} from "@/model/CommonMasterModal";
import { NextRequest } from "next/server";

export const CommonDropdown = async (
  req: NextRequest,
  context: ContexInterface,
  body: CommonDropdownPayload
) => {
  await dbconnect();
  try {
    const { type } = body;

    const matchCondition =
      Array.isArray(type) && type.length > 0
        ? { active: true, mastername: { $in: type } }
        : { active: true };

    const DropdownData = await CommonMasterModel.aggregate([
      { $match: matchCondition },
      {
        $project: {
          mastername: 1,
          subdata: 1,
          _id: 0,
        },
      },
    ]);

    const formatted = DropdownData.reduce((acc: any, item: any) => {
      const key = item.mastername.replace(/\s+/g, "");
      acc[key] = item.subdata?.map((item: CommonMasterSubData) => {
        return {
          id: item.keyid,
          value: item.keyvalue,
        };
      });
      return acc;
    }, {});

    return commonResponse(true, "", formatted);
  } catch (error) {
    console.error("Error fetching common dropdown:", error);
    return commonResponse(false, "Failed to fetch common dropdown", error, 500);
  }
};

export const POST = withAuth(CommonDropdown);
