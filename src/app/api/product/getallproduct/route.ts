import { commonResponse } from "@/helper/commonResponbeen";
import { isNullEmpty } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import { getAllProductListpayload } from "@/interfaces/ProductInterface";
import dbconnect from "@/lib/dbConnect";
import { Product } from "@/model/Product";
import { FilterQuery } from "mongoose";
import { NextRequest } from "next/server";
import ProductModal from "@/model/Product";
import { toObjectId } from "@/lib/helper";

export const GetAllProduct = async (
  req: NextRequest,
  context: ContexInterface,
  body: getAllProductListpayload
) => {
  await dbconnect();
  try {
    const { page, pagesize, search, categoryid, pricerange, sortby } = body;

    const isvalid = validatepayload(body);
    if (isvalid) {
      return commonResponse(false, isvalid, "", 400);
    }

    // Build query
    const query: FilterQuery<Product> = { active: true };

    // Category filter
    if (categoryid && Array.isArray(categoryid) && categoryid.length > 0) {
      query.category = { $in: categoryid.map((id) => toObjectId(id)) };
    }

    // Search filter - ensure search is a string
    if (search && typeof search === "string" && search.trim() !== "") {
      const searchTerm = search.trim();
      const isNumeric = !isNaN(Number(searchTerm));

      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ];

      if (isNumeric) {
        query.$or.push({ price: Number(searchTerm) });
        query.$or.push({ stock: Number(searchTerm) });
      }
    }

    // Price range filter
    if (pricerange && Array.isArray(pricerange) && pricerange.length === 2) {
      const [minPrice, maxPrice] = pricerange;
      const min = Number(minPrice);
      const max = Number(maxPrice);

      if (!isNaN(min) && !isNaN(max) && min >= 0 && max >= min) {
        query.price = {
          $gte: min,
          $lte: max,
        };
      }
    }

    // Sorting - using literal 1 and -1 instead of SortOrder type
    let sort: Record<string, 1 | -1> = { _id: -1 }; // Default sort

    if (sortby && typeof sortby === "string") {
      switch (sortby.toLowerCase()) {
        case "1":
          sort = { price: 1 };
          break;
        case "2":
          sort = { price: -1 };
          break;
        case "3":
          sort = { _id: -1 };
          break;
        case "4":
          sort = { _id: 1 };
          break;
        default:
          sort = { _id: -1 };
      }
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(pagesize);
    const limit = Number(pagesize);

    // Get counts
    const totalFilteredCount = await ProductModal.countDocuments(query);
    const totalCount = await ProductModal.countDocuments({ active: true });

    // Calculate date threshold for "new" products (e.g., 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const currentDate = new Date();

    // Fetch products with aggregation pipeline
    const ProductList = await ProductModal.aggregate([
      {
        $match: query,
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
          reviewCount: { $size: "$reviews" },
          mainImage: {
            $let: {
              vars: {
                mainImg: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$images",
                        as: "img",
                        cond: { $eq: ["$$img.isMain", true] },
                      },
                    },
                    0,
                  ],
                },
              },
              in: {
                $ifNull: [
                  "$$mainImg.url",
                  { $arrayElemAt: ["$images.url", 0] },
                ],
              },
            },
          },
          isNew: {
            $gte: [
              {
                $toDate: "$_id",
              },
              thirtyDaysAgo,
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
        },
      },
      {
        $sort: sort,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          id: "$_id",
          name: 1,
          price: 1,
          finalPrice: 1,
          image: "$mainImage",
          rating: "$averageRating",
          reviews: "$reviewCount",
          stock: 1,
          isNew: 1,
          hasValidOffer: 1,
          //   offer: "$offerDiscount",
          _id: 0,
        },
      },
    ]);

    const responsBody = {
      data: ProductList,
      recordsFiltered: totalFilteredCount,
      recordsTotal: totalCount,
    };

    return commonResponse(true, "", responsBody, 200);
  } catch (error) {
    console.error("Error fetching products:", error);
    return commonResponse(false, "Failed to fetch product list", error, 500);
  }
};

const validatepayload = (payload: getAllProductListpayload): string => {
  const { page, pagesize } = payload;

  if (isNullEmpty(page) || isNullEmpty(pagesize)) {
    return "Page and pagesize are required";
  }

  if (Number(page) < 1) {
    return "Page must be greater than 0";
  }

  if (Number(pagesize) < 1 || Number(pagesize) > 100) {
    return "Pagesize must be between 1 and 100";
  }

  return "";
};

export const POST = withAuth(GetAllProduct);
