import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import CategoryModal from "@/model/Category";
import { NextRequest } from "next/server";

export const GetAllCategoryList = async (
  req: NextRequest,
  context: ContexInterface,
  body: any
) => {
  await dbconnect();
  try {
    const categoryList = await CategoryModal.find({ active: true }).select(
      "name _id"
    );

    const responseBody = categoryList?.map((item) => {
      return {
        id: item?._id,
        value: item?.name,
      };
    });
    return commonResponse(true, "", responseBody, 200);
  } catch (error) {
    console.error("Error fetching products:", error);
    return commonResponse(false, "Failed to fetch category list", error, 500);
  }
};

export const POST = withAuth(GetAllCategoryList);
