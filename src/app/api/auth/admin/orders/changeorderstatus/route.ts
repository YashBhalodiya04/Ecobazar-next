import { commonResponse } from "@/helper/commonResponbeen";
import { isNullEmpty } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import { OrderStatusCangePayload } from "@/interfaces/OrdersInterface";
import dbconnect from "@/lib/dbConnect";
import OrderModel from "@/model/OrderModal";
import ProductModel from "@/model/Product";
import { NextRequest } from "next/server";

export const ChangeOrderStatus = async (
  req: NextRequest,
  context: ContexInterface,
  body: OrderStatusCangePayload
) => {
  await dbconnect();
  try {
    if (!context?.user?.isadmin) {
      return commonResponse(false, "You are not authorized", "", 403);
    }
    if (!validatePayload(body)) {
      return commonResponse(false, "Parameter is missing", "", 200);
    }

    const { orderid, status, itemdata } = body;
    const order = await OrderModel.findOne({ _id: orderid, active: true });
    if (!order) {
      return commonResponse(false, "Order not found", "", 404);
    }
    order.orderStatus = status;

    // If full order is cancelled → restore stock for all items
    if (status === "cancelled") {
      for (const item of order.items) {
        await ProductModel.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } },
          { new: true }
        );
      }
      const neworderitems = order.items.map((item) => {
        return {
          ...item,
          itemStatus: status,
          rejectionReason: "",
        };
      });
      order.items = neworderitems;
    } else {
      const neworderitems = await Promise.all(
        order.items.map(async (item) => {
          const data = itemdata?.find(
            (i) => i.productid?.toString() === item?.product?.toString()
          );
          if (!data) return item;

          // If this item is cancelled → increase stock
          if (data.productstatus === "cancelled") {
            await ProductModel.findByIdAndUpdate(
              item.product,
              { $inc: { stock: item.quantity } }, // increase stock based on quantity
              { new: true }
            );
          }

          return {
            ...item,
            itemStatus: data.productstatus,
            rejectionReason: data.rejectionReason,
          };
        })
      );
      order.items = neworderitems;
    }

    await order.save();
    return commonResponse(true, "Order status changed successfully", "", 200);
  } catch (error) {
    console.error("Change Order Status Error:", error);
    return commonResponse(false, "Failed to change order status", error, 500);
  }
};

const validatePayload = (body: OrderStatusCangePayload) => {
  if (
    isNullEmpty(body?.orderid) ||
    isNullEmpty(body?.status) ||
    !body?.itemdata
  ) {
    return false;
  }
  return true;
};

export const POST = withAuth(ChangeOrderStatus);
