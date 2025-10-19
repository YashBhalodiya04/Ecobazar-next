import { commonResponse } from "@/helper/commonResponbeen";
import { isNullEmpty } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import {
  CommonDeletePayloadInterface,
  ContexInterface,
} from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import { toObjectId } from "@/lib/helper";
import ProductModal from "@/model/Product";
import { NextRequest } from "next/server";

export const DeleteProduct = async (
  req: NextRequest,
  context: ContexInterface,
  body: CommonDeletePayloadInterface
) => {
  await dbconnect();
  try {
    if (!context?.user?.isadmin) {
      return commonResponse(false, "You are not authorized", "", 401);
    }
    if (isNullEmpty(body?.productid)) {
      return commonResponse(false, "Product ID is required");
    }
    const productID = toObjectId(body.productid);
    const product = await ProductModal.findById(productID, { active: true });
    if (!product) {
      return commonResponse(false, "Product not found");
    }
    await ProductModal.findByIdAndUpdate(productID, { active: false });
    return commonResponse(true, "Product deleted successfully");
  } catch (error) {
    console.error(error);
    return commonResponse(false, "Error On Delete Product", error);
  }
};

export const POST = withAuth(DeleteProduct);
