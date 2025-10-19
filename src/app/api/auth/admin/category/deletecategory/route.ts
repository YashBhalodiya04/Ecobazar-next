import { commonResponse } from "@/helper/commonResponbeen";
import { isNullEmpty } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import {
  CommonDeletePayloadInterface,
  ContexInterface,
} from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import { toObjectId } from "@/lib/helper";
import CategoryModal from "@/model/Category";
import ProductModal from "@/model/Product";
import { NextRequest } from "next/server";

export const DeleteCategory = async (
  req: NextRequest,
  context: ContexInterface,
  body: CommonDeletePayloadInterface
) => {
  await dbconnect();
  try {
    if (!context?.user?.isadmin) {
      return commonResponse(false, "You are not authorized", "", 401);
    }

    if (isNullEmpty(body.categoryid)) {
      return commonResponse(false, "Category ID is required");
    }
    const categoryID = toObjectId(body.categoryid);
    const category = await CategoryModal.findById(categoryID, { active: true });
    if (!category) {
      return commonResponse(false, "Category not found");
    }

    await CategoryModal.findByIdAndUpdate(categoryID, { active: false });

    await ProductModal.updateMany(
      { categoryid: categoryID },
      { active: false }
    );

    return commonResponse(true, "Category deleted successfully");
  } catch (error) {
    console.error(error);
    return commonResponse(false, "Error On Delete Category", error);
  }
};

export const POST = withAuth(DeleteCategory);
