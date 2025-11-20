import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import { toObjectId } from "@/lib/helper";
import OrderModel from "@/model/OrderModal";
import UserModal from "@/model/User";
import { NextRequest } from "next/server";

export const GetUserProfile = async (
  req: NextRequest,
  context: ContexInterface,
  body: any
) => {
  await dbconnect();
  try {
    const userid = toObjectId(context?.user?.id);

    const UserData = await UserModal.findById(userid).select(
      "username email phone userimage billingAddress"
    );

    const UserOrderDetail = await OrderModel.aggregate([
      {
        $match: { user: userid, active: true },
      },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
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
          as: "itemStatusData",
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
          as: "OrderStatusSubData",
        },
      },
      {
        $addFields: {
          items: {
            $map: {
              input: "$items",
              as: "item",
              in: {
                quantity: "$$item.quantity",
                price: "$$item.price",
                productid: "$$item.product",
                subtotal: "$$item.subtotal",
                rejectionReason: "$$item.rejectionReason",
                itemStatus: {
                  $let: {
                    vars: {
                      statusMatch: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$itemStatusData",
                              as: "status",
                              cond: {
                                $eq: ["$$status.keyid", "$$item.itemStatus"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: "$$statusMatch.keyvalue",
                  },
                },
                product: {
                  name: {
                    $let: {
                      vars: {
                        p: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: "$productDetails",
                                as: "pd",
                                cond: { $eq: ["$$pd._id", "$$item.product"] },
                              },
                            },
                            0,
                          ],
                        },
                      },
                      in: "$$p.name",
                    },
                  },
                  mainImage: {
                    $let: {
                      vars: {
                        p: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: "$productDetails",
                                as: "pd",
                                cond: { $eq: ["$$pd._id", "$$item.product"] },
                              },
                            },
                            0,
                          ],
                        },
                      },
                      in: {
                        $arrayElemAt: [
                          {
                            $map: {
                              input: {
                                $filter: {
                                  input: "$$p.images",
                                  as: "img",
                                  cond: { $eq: ["$$img.isMain", true] },
                                },
                              },
                              as: "m",
                              in: "$$m.url",
                            },
                          },
                          0,
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
          orderStatus: {
            $reduce: {
              input: "$OrderStatusSubData",
              initialValue: null,
              in: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$$value", null] },
                      { $eq: ["$$this.keyid", "$orderStatus"] },
                    ],
                  },
                  "$$this.keyvalue",
                  "$$value",
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          orderStatus: 1,
          createdAt: 1,
          finalAmount: 1,
          "items.quantity": 1,
          "items.price": 1,
          "items.productid": 1,
          "items.subtotal": 1,
          "items.product.name": 1,
          "items.product.mainImage": 1,
          "items.itemStatus": 1,
          "items.rejectionReason": 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    if (!UserData) {
      return commonResponse(false, "User not found", "", 200);
    }

    const user = UserData.toObject();

    const formattedUser = {
      username: user.username,
      email: user.email,
      phone: user.phone,
      userimage: user.userimage,
      billingAddress: user.billingAddress?.map((addr: any) => ({
        firstName: addr.firstName,
        lastName: addr.lastName,
        address: addr.address,
        city: addr.city,
        state: addr.state,
        zipCode: addr.zipCode,
        country: addr.country,
        phoneNumber: addr.phoneNumber,
        isPrimary: addr.isPrimary ?? false,
      })),
      orderDetail: UserOrderDetail,
    };

    return commonResponse(true, "", formattedUser, 200);
  } catch (error) {
    console.error("Error getting user profile:", error);
    return commonResponse(false, "Failed to get user profile", error, 500);
  }
};

export const POST = withAuth(GetUserProfile);
