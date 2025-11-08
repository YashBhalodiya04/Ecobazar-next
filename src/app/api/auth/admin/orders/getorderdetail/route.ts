import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import {
  CommonDeletePayloadInterface,
  ContexInterface,
} from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import { isNullEmpty } from "../../../../../../helper/CommonUtils";
import OrderModel from "@/model/OrderModal";
import { toObjectId } from "@/lib/helper";

export const GetOrderDetail = async (
  req: NextRequest,
  context: ContexInterface,
  body: CommonDeletePayloadInterface
) => {
  await dbconnect();
  try {
    if (!context?.user?.isadmin) {
      return commonResponse(false, "You are not authorized", "", 401);
    }

    if (isNullEmpty(body?.id)) {
      return commonResponse(false, "Parameter is missing", "", 200);
    }

    const CurrentOrder = await OrderModel.findOne({
      _id: body?.id,
      active: true,
    });
    console.log(body?.id);
    if (!CurrentOrder) {
      return commonResponse(false, "Order not found", "", 404);
    }

    const orders = await OrderModel.aggregate([
      {
        $match: {
          _id: toObjectId(body?.id),
          active: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userdetails",
        },
      },
      {
        $unwind: {
          path: "$userdetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$items",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "items.productDetails",
        },
      },
      {
        $unwind: {
          path: "$items.productDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "items.productDetails.category",
          foreignField: "_id",
          as: "items.productDetails.categoryDetails",
        },
      },
      {
        $unwind: {
          path: "$items.productDetails.categoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "items.productDetails.mainImage": {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$items.productDetails.images",
                  as: "img",
                  cond: { $eq: ["$$img.isMain", true] },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          items: {
            $push: {
              product: "$items.product",
              quantity: "$items.quantity",
              price: "$items.price",
              productName: "$items.productDetails.name",
              mainImage: "$items.productDetails.mainImage.url",
              categoryName: "$items.productDetails.categoryDetails.name",
              stock: "$items.productDetails.stock",
            },
          },
          shippingAddress: { $first: "$shippingAddress" },
          paymentInfo: { $first: "$paymentInfo" },
          orderStatus: { $first: "$orderStatus" },
          username: { $first: "$userdetails.username" },
        },
      },
    ]);

    const finalResp = orders[0];
    return commonResponse(true, "", finalResp);
  } catch (error) {
    console.error("Get Orders Error:", error);
    return commonResponse(false, "Failed to get order detail", error, 500);
  }
};

export const POST = withAuth(GetOrderDetail);
