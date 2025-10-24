import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import { CommoPayloadGrid, ContexInterface } from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import MainSliderModal, { MainSlider } from "@/model/MainSlider";
import { FilterQuery } from "mongoose";
import { NextRequest } from "next/server";

export const GetAllSliders = async (
  req: NextRequest,
  context: ContexInterface,
  body: CommoPayloadGrid
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

    const query: FilterQuery<MainSlider> = { active: true };
    if (search.trim() !== "") {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination logic
    const skip = (Number(page) - 1) * Number(pagesize);

    // Get total count for pagination
    const totalFilteredCount = await MainSliderModal.countDocuments(query);
    const totalCount = await MainSliderModal.countDocuments({ active: true });

    const sliderList = await MainSliderModal.find(query)
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(Number(pagesize))
      .select("_id active title description image fromDate toDate")
      .lean();

    const response = {
      recordsFiltered: totalFilteredCount,
      recordsTotal: totalCount,
      data: sliderList?.map((item) => {
        return {
          sliderid: String(item?._id),
          active: item?.active,
          title: item?.title,
          description: item?.description,
          image: item?.image,
          fromDate: item?.fromDate,
          toDate: item?.toDate,
        };
      }),
    };
    return commonResponse(true, "", response, 200);
  } catch (error) {
    console.error(error);
    return commonResponse(false, "Failed to get sliders", error);
  }
};

const validatePayload = (body: CommoPayloadGrid): boolean => {
  const { page, pagesize } = body;
  if (!page || !pagesize) {
    return false;
  }
  return true;
};

export const POST = withAuth(GetAllSliders);
