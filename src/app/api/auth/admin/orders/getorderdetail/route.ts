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
    })
      .populate({
        path: "user",
        select: "username email phone",
      })
      .populate({
        path: "items.product",
        select: "name images stock category",
        populate: {
          path: "category",
          model: "Category", // <--- important
          select: "name",
        },
      })
      .lean();

    if (!CurrentOrder) {
      return commonResponse(false, "Order not found", "", 404);
    }

    // const formattedOrder = {
    //   _id: CurrentOrder._id,
    //   user: {
    //     username: CurrentOrder.user?.username,
    //     email: CurrentOrder.user?.email,
    //     phone: CurrentOrder.user?.phone,
    //   },
    //   items: CurrentOrder.items.map((item) => ({
    //     productId: item.product?._id,
    //     price: item.price,
    //     quantity: item.quantity,
    //     subtotal: item.subtotal,
    //     productInfo: item.product,
    //   })),

    //   shippingAddress: CurrentOrder.shippingAddress,
    //   paymentInfo: CurrentOrder.paymentInfo,
    //   orderStatus: CurrentOrder.orderStatus,
    //   totalAmount: CurrentOrder.totalAmount,
    //   discount: CurrentOrder.discount,
    //   finalAmount: CurrentOrder.finalAmount,
    //   tracking: CurrentOrder.tracking,
    //   createdAt: CurrentOrder.createdAt,
    // };

    return commonResponse(true, "", CurrentOrder);
  } catch (error) {
    console.error("Get Orders Error:", error);
    return commonResponse(false, "Failed to get order detail", error, 500);
  }
};

export const POST = withAuth(GetOrderDetail);
