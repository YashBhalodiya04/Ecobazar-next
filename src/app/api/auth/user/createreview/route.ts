import { commonResponse } from "@/helper/commonResponbeen";
import { isNullEmpty } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import { CreateProductReviewPayload } from "@/interfaces/ProductInterface";
import dbconnect from "@/lib/dbConnect";
import { toObjectId } from "@/lib/helper";
import ProductModel from "@/model/Product";
import { NextRequest } from "next/server";

export const CreateReview = async (
  req: NextRequest,
  context: ContexInterface,
  body: CreateProductReviewPayload
) => {
  await dbconnect();
  try {
    const { productId, rating, comment } = body;
    const isvalid = validatepayload(body);
    if (isvalid) {
      return commonResponse(false, isvalid, "", 400);
    }
    const user = context?.user;

    await ProductModel.findByIdAndUpdate(toObjectId(productId), {
      $push: {
        reviews: {
          user: user?.id,
          rating,
          comment,
          createdAt: new Date(),
        },
      },
    });
    return commonResponse(true, "Review created successfully", "", 200);
  } catch (error) {
    console.error("Error creating review:", error);
    return commonResponse(false, "Failed to create review", error, 500);
  }
};

const validatepayload = (payload: CreateProductReviewPayload): string => {
  const { productId, rating, comment } = payload;

  if (isNullEmpty(productId) || isNullEmpty(rating) || isNullEmpty(comment)) {
    return "Product ID, rating, and comment are required";
  }

  if (Number(rating) < 1) {
    return "Rating must be greater than 0";
  }

  if (Number(rating) > 5) {
    return "Rating must be less than or equal to 5";
  }

  if (comment.length > 255) {
    return "Comment must be less than or equal to 255 characters";
  }

  return "";
};

export const POST = withAuth(CreateReview);
