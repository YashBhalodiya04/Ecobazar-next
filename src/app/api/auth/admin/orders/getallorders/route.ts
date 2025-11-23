import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import { OrderGetAllPayload } from "@/interfaces/OrdersInterface";
import dbconnect from "@/lib/dbConnect";
import OrderModel, { Order } from "@/model/OrderModal";
import { FilterQuery } from "mongoose";
import { NextRequest } from "next/server";

export const GetAllOrders = async (
  req: NextRequest,
  context: ContexInterface,
  body: OrderGetAllPayload
) => {
  await dbconnect();
  try {
    if (!context?.user?.isadmin) {
      return commonResponse(false, "You are not authorized", "", 403);
    }

    if (!validatePayload(body)) {
      return commonResponse(false, "Parameter is missing", "", 200);
    }

    const {
      search = "",
      page = 1,
      pagesize = 10,
      orderstatus,
      paymentstatus,
    } = body;
    const skip = (page - 1) * pagesize;

    const matchStage: FilterQuery<Order> = { active: true };

    if (search.trim() !== "") {
      const regex = new RegExp(search, "i");

      matchStage.$or = [
        { "userInfo.username": regex },
        { "userInfo.email": regex },
        { "userInfo.phone": regex },
        { "paymentInfo.status": paymentstatus },
        { orderStatus: orderstatus },
        { trackingNumber: regex },
      ];

      if (!isNaN(Number(search))) {
        matchStage.$or.push({ totalAmount: Number(search) });
        matchStage.$or.push({ finalAmount: Number(search) });
      }
    }

    const basePipeline = [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      { $addFields: { trackingNumber: "$tracking.trackingNumber" } },
      { $match: matchStage },
    ];

    // Count matching records
    const filteredCountResult = await OrderModel.aggregate([
      ...basePipeline,
      { $count: "filteredCount" },
    ]);

    const recordsFiltered = filteredCountResult[0]?.filteredCount || 0;

    // Get paginated list
    const orders = await OrderModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $lookup: {
          from: "commonmasters",
          pipeline: [
            { $match: { mastername: "Order Status" } },
            { $unwind: "$subdata" },
            { $replaceRoot: { newRoot: "$subdata" } },
          ],
          as: "orderStatusData",
        },
      },
      {
        $lookup: {
          from: "commonmasters",
          pipeline: [
            { $match: { mastername: "Payment Status" } },
            { $unwind: "$subdata" },
            { $replaceRoot: { newRoot: "$subdata" } },
          ],
          as: "paymentStatusData",
        },
      },
      { $unwind: "$userInfo" },
      { $addFields: { trackingNumber: "$tracking.trackingNumber" } },
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: pagesize },
      {
        $project: {
          _id: "$_id",
          username: "$userInfo.username",
          useremail: "$userInfo.email",
          phone: "$userInfo.phone", // ✅ NOW YOU GET PHONE
          // paymentStatus: "$paymentInfo.status",
          // orderStatus: 1,
          totalAmount: 1,
          finalAmount: 1,
          trackingNumber: 1,
          createdAt: 1,
          orderStatus: {
            $let: {
              vars: {
                match: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$orderStatusData",
                        as: "st",
                        cond: { $eq: ["$$st.keyid", "$orderStatus"] },
                      },
                    },
                    0,
                  ],
                },
              },
              in: "$$match.keyvalue",
            },
          },
          paymentStatus: {
            $let: {
              vars: {
                match: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$paymentStatusData",
                        as: "pst",
                        cond: { $eq: ["$$pst.keyid", "$paymentInfo.status"] },
                      },
                    },
                    0,
                  ],
                },
              },
              in: "$$match.keyvalue",
            },
          },
        },
      },
    ]);

    const recordsTotal = await OrderModel.countDocuments({ active: true });

    const responseBody = {
      data: orders,
      recordsFiltered,
      recordsTotal,
    };

    return commonResponse(true, "", responseBody);
  } catch (error) {
    console.error("Get Orders Error:", error);
    return commonResponse(false, "Failed to fetch orders", error, 500);
  }
};

const validatePayload = (body: OrderGetAllPayload): boolean => {
  const { page, pagesize } = body;
  return Boolean(page && pagesize);
};

export const POST = withAuth(GetAllOrders);
