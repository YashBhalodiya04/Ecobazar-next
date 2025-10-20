import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import CategoryModal from "@/model/Category";
import { NextRequest } from "next/server";

export const GetAllCategory = async (
  req: NextRequest,
  context: ContexInterface,
  body: null
) => {
  await dbconnect();
  try {
    if (!context?.user?.isadmin) {
      return commonResponse(false, "You are not authorized", "", 401);
    }

    const categoryList = await CategoryModal.find({ active: true })
      .sort({ createdAt: -1 })
      .select("_id name")
      .lean();

    const finaldata = categoryList?.map((item) => {
      return {
        id: item?._id,
        value: item?.name,
      };
    });
    return commonResponse(true, "", finaldata, 200);
  } catch (error) {
    console.error(error);
    return commonResponse(false, "Failed to get category", error);
  }
};


export const POST = withAuth(GetAllCategory);