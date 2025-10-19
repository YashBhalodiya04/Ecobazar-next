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
      query.category = toObjectId(categoryid);
    }

    if (search?.trim() != "") {
      const isNumeric = !isNaN(Number(search));
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
      if (isNumeric) {
        query.$or.push({ price: Number(search) });
      }
    }

    const skip = (Number(page) - 1) * Number(pagesize);

    const totalFilteredCount = await ProductModal.countDocuments(query);
    const totalCount = await ProductModal.countDocuments({ active: true });

    const productList = await ProductModal.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(pagesize))
      .select("_id name description price image category stock rating active")
      .lean();

    const ResponseBody = {
      data: productList?.map((item) => {
        return {
          id: item?._id,
          name: item?.name,
          description: item?.description,
          price: item?.price,
          image: item?.image,
          category: item?.category,
          stock: item?.stock,
          active: item?.active,
        };
      }),
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
