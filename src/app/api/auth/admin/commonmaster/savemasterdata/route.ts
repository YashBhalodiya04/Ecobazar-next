import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import { CommonMasterPayload } from "@/interfaces/CommonMasterInterface";
import dbconnect from "@/lib/dbConnect";
import CommonMasterModel from "@/model/CommonMasterModal";
import { NextRequest } from "next/server";
import { isNullEmpty } from "../../../../../../helper/CommonUtils";
import { toObjectId } from "@/lib/helper";

export const SaveMasterData = async (
  req: NextRequest,
  context: ContexInterface,
  body: CommonMasterPayload
) => {
  await dbconnect();
  try {
    if (!context?.user?.isadmin) {
      return commonResponse(false, "You are not authorized", "", 401);
    }
    const { masterid, mastername, remarks, subdata } = body;

    if (isNullEmpty(mastername?.trim())) {
      return commonResponse(false, "Master name is required");
    }
    if (isNullEmpty(subdata)) {
      return commonResponse(false, "Subdata is required");
    }
    const keyidSet = new Set();
    const keyvalueSet = new Set();

    for (let item of subdata) {
      if (!item.keyid?.trim() || !item.keyvalue?.trim()) {
        return commonResponse(false, "keyid and keyvalue are required");
      }

      if (keyidSet.has(item.keyid.toLowerCase())) {
        return commonResponse(false, `Duplicate keyid: ${item.keyid}`);
      }
      if (keyvalueSet.has(item.keyvalue.toLowerCase())) {
        return commonResponse(false, `Duplicate keyvalue: ${item.keyvalue}`);
      }

      keyidSet.add(item.keyid.toLowerCase());
      keyvalueSet.add(item.keyvalue.toLowerCase());
    }

    const existingMaster = await CommonMasterModel.findOne({
      mastername: mastername.trim(),
      _id: { $ne: toObjectId(masterid) || undefined },
      active: true,
    });

    if (existingMaster) {
      return commonResponse(false, "Master name already exists");
    }
    if (masterid) {
      await CommonMasterModel.findByIdAndUpdate(
        toObjectId(masterid),
        {
          mastername,
          remarks,
          subdata,
        },
        { new: true }
      );

      return commonResponse(true, "Master data updated successfully");
    } else {
      await CommonMasterModel.create({
        mastername,
        remarks,
        subdata,
        active: true,
      });

      return commonResponse(true, "Master data saved successfully");
    }
  } catch (error) {
    console.error("Save Master Data Error:", error);
    return commonResponse(false, "Failed to save master data", error, 500);
  }
};

export const POST = withAuth(SaveMasterData);
