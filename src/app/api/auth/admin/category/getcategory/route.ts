import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import { CategoryGetPayload } from "@/interfaces/CategoryInterface";
import { ContexInterface } from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import CategoryModal from "@/model/Category";
import { NextRequest } from "next/server";

export const GetCategory = async (
  req: NextRequest,
  context: ContexInterface,
  body: CategoryGetPayload
) => {
  await dbconnect();
  try {
    if (!context?.user?.isadmin) {
      return commonResponse(false, "You are not authorized", "", 401);
    }
    if (!validatePayload(body)) {
      return commonResponse(false, "Parameter is missing", "", 200);
    }

    const { search = "", page = 1, pagesize = 10 } = body;

    const query: any = { active: true };
    // If search is provided, add case-insensitive regex filter
    if (search.trim() !== "") {
      query.name = { $regex: search, $options: "i" };
    }

    // Pagination logic
    const skip = (Number(page) - 1) * Number(pagesize);

    // Get total count for pagination
    const totalCount = await CategoryModal.countDocuments({ active: true });

    // Fetch paginated + searched data
    const categoryList = await CategoryModal.find(query)
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(Number(pagesize)).select("_id active name description image").lean()

    const FinalData = {
      data: categoryList?.map((item) => {
        return {
          categoryid: item?._id,
          active: item?.active,
          name: item?.name,
          description: item?.description,
          image: item?.image,
        }
      }),
      total: totalCount,
      currentPage: Number(page),
    };

    return commonResponse(true, "", FinalData, 200);
  } catch (error) {
    console.error(error);
    return commonResponse(false, "Failed to get category", error);
  }
};
export const POST = withAuth(GetCategory);

const validatePayload = (body: CategoryGetPayload): boolean => {
  const { page, pagesize } = body;
  if (!page || !pagesize) {
    return false;
  }
  return true;
};
