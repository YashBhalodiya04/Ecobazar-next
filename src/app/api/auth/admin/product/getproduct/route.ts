import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import { ProductGetAllPayload } from "@/interfaces/ProductInterface";
import dbconnect from "@/lib/dbConnect";
import ProductModal, { Product } from "@/model/Product";
import { NextRequest } from "next/server";
import { toObjectId } from "../../../../../../lib/helper";
import { FilterQuery } from "mongoose";

export const GetProduct = async (
  req: NextRequest,
  context: ContexInterface,
  body: ProductGetAllPayload
) => {
  await dbconnect();
  try {
    if (!context?.user?.isadmin) {
      return commonResponse(false, "You are not authorized", "", 401);
    }
    if (!validatePayload(body)) {
      return commonResponse(false, "Parameter is missing", "", 200);
    }
    const { search = "", page = 1, pagesize = 10, categoryid } = body;

    const query: FilterQuery<Product> = { active: true };
    if (categoryid) {
      query.category = categoryid;
    }

    if (search?.trim() != "") {
      const isNumeric = !isNaN(Number(search));
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
      if (isNumeric) {
        query.$or.push({ price: Number(search) });
        query.$or.push({ stock: Number(search) });
      }
    }

    const skip = (Number(page) - 1) * Number(pagesize);

    const totalFilteredCount = await ProductModal.countDocuments(query);
    const totalCount = await ProductModal.countDocuments({ active: true });

    // ✅ Populate category name
    const productList = await ProductModal.aggregate([
      { $match: query },
      {
        $addFields: {
          categoryObjectId: {
            $cond: [
              {
                $regexMatch: { input: "$category", regex: /^[0-9a-fA-F]{24}$/ },
              },
              { $toObjectId: "$category" },
              null,
            ],
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryObjectId",
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
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          image: 1,
          stock: 1,
          active: 1,
          categoryName: "$categoryInfo.name",
          categoryid: "$category",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (Number(page) - 1) * Number(pagesize) },
      { $limit: Number(pagesize) },
    ]);
    const ResponseBody = {
      data: productList?.map((item) => ({
        id: item?._id,
        name: item?.name,
        description: item?.description,
        price: item?.price,
        image: item?.image,
        category: item?.categoryName ?? "",
        stock: item?.stock,
        active: item?.active,
        categoryid: item?.categoryid,
      })),
      recordsFiltered: totalFilteredCount,
      recordsTotal: totalCount,
    };
    return commonResponse(true, "", ResponseBody, 200);
  } catch (error) {
    console.error(error);
    return commonResponse(false, "Failed to get product", error);
  }
};

const validatePayload = (body: ProductGetAllPayload): boolean => {
  const { page, pagesize } = body;
  if (!page || !pagesize) {
    return false;
  }
  return true;
};

export const POST = withAuth(GetProduct);
