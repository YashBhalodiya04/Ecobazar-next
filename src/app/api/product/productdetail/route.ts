import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import {
  CommonDeletePayloadInterface,
  ContexInterface,
} from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import { toObjectId } from "@/lib/helper";
import ProductModel, { Product } from "@/model/Product";
import UserModal from "@/model/User";
import { PipelineStage } from "mongoose";
import { NextRequest } from "next/server";

export const GetProductDetail = async (
  req: NextRequest,
  context: ContexInterface,
  body: CommonDeletePayloadInterface
) => {
  await dbconnect();
  try {
    const { productid } = body;

    const userId = toObjectId(context?.user?.id);
    const currentDate = new Date();

    const mainQuerypipeline: PipelineStage[] = [
      {
        $match: { _id: toObjectId(productid), active: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "reviews.user",
          foreignField: "_id",
          as: "reviewUsers",
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: {
                $avg: "$reviews.rating",
              },
              else: 0,
            },
          },
          reviewCount: {
            $size: "$reviews",
          },
          imagelist: {
            $map: {
              input: "$images",
              as: "img",
              in: {
                id: "$_id",
                url: "$$img.url",
                isMain: "$$img.isMain",
              },
            },
          },
          categoryid: {
            $cond: [
              {
                $regexMatch: { input: "$category", regex: /^[0-9a-fA-F]{24}$/ },
              },
              { $toObjectId: "$category" },
              null,
            ],
          },
          hasValidOffer: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$offer", null] },
                  { $ne: ["$offer.validUntil", null] },
                  { $gte: ["$offer.validUntil", currentDate] },
                  { $gt: ["$offer.discountPercent", 0] },
                ],
              },
              then: true,
              else: false,
            },
          },
          finalPrice: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$offer", null] },
                  { $ne: ["$offer.validUntil", null] },
                  { $gte: ["$offer.validUntil", currentDate] },
                  { $gt: ["$offer.discountPercent", 0] },
                ],
              },
              then: {
                $round: [
                  {
                    $subtract: [
                      "$price",
                      {
                        $multiply: [
                          "$price",
                          { $divide: ["$offer.discountPercent", 100] },
                        ],
                      },
                    ],
                  },
                  2,
                ],
              },
              else: "$price",
            },
          },
          offerDiscount: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$offer", null] },
                  { $ne: ["$offer.validUntil", null] },
                  { $gte: ["$offer.validUntil", currentDate] },
                  { $gt: ["$offer.discountPercent", 0] },
                ],
              },
              then: "$offer.discountPercent",
              else: 0,
            },
          },
          additionalInfo: {
            $map: {
              input: "$additionalInfo",
              as: "info",
              in: {
                id: "$$info._id",
                title: "$$info.title",
                fields: {
                  $map: {
                    input: "$$info.fields",
                    as: "field",
                    in: {
                      id: "$$field._id",
                      label: "$$field.label",
                      value: "$$field.value",
                    },
                  },
                },
              },
            },
          },
          reviewData: {
            $map: {
              input: "$reviews",
              as: "r",
              in: {
                id: "$$r._id",
                rating: "$$r.rating",
                comment: "$$r.comment",
                date: "$$r.date",
                user: {
                  $let: {
                    vars: {
                      userInfo: {
                        $first: {
                          $filter: {
                            input: "$reviewUsers",
                            as: "u",
                            cond: { $eq: ["$$u._id", "$$r.user"] },
                          },
                        },
                      },
                    },
                    in: {
                      id: "$$userInfo._id",
                      username: "$$userInfo.username",
                      userimage: "$$userInfo.userimage",
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryid",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: {
          path: "$categoryInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: 1,
          avgrating: "$averageRating",
          reviewCount: 1,
          imagelist: 1,
          categoryName: "$categoryInfo.name",
          hasValidOffer: 1,
          finalPrice: 1,
          offerDiscount: 1,
          price: "$price",
          productdetailsdata: "$additionalInfo",
          reviews: "$reviewData",
          stock: "$stock",
          description: "$description",
        },
      },
    ];

    const product = await ProductModel.aggregate<Product>(mainQuerypipeline);

    let ResponseBody = null;
    if (product?.length > 0) {
      ResponseBody = product[0];
    }

    // 👇 Add this block to include productCartQuantity if user logged in
    if (userId) {
      const user = await UserModal.findById(userId, { cart: 1 }).lean();
      console.log(user)
      if (user && user.cart?.length > 0) {
        const item = user.cart.find(
          (c: any) => c.productId?.toString() === productid
        );
        ResponseBody.productCartQuantity = item ? item.quantity : 0;
      } else {
        ResponseBody.productCartQuantity = 0;
      }
    }
    // console.log(ResponseBody)

    return commonResponse(true, "", ResponseBody, 200);
  } catch (error) {
    console.error("Error fetching products:", error);
    return commonResponse(false, "Failed to fetch category list", error, 500);
  }
};

export const POST = withAuth(GetProductDetail);
