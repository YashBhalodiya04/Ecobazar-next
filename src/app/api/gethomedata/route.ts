import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import {
  categoryData,
  ContexInterface,
  HomeDataResponse,
  MainSliderData,
} from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import CategoryModal from "@/model/Category";
import MainSliderModal from "@/model/MainSlider";
import ProductModal from "@/model/Product";
import dayjs from "dayjs";
import { NextRequest } from "next/server";

export const GetSliders = async (
  req: NextRequest,
  context: ContexInterface,
  body: any
) => {
  await dbconnect();
  try {
    const today = dayjs().startOf("day").toDate();

    // Fetch sliders where "to" is today or later
    const sliderdata = await MainSliderModal.find({
      to: { $gte: today },
      active: true,
    })
      .sort({ fromDate: 1 })
      .select("title description image");

    const categorydata = await CategoryModal.find({ active: true }).select(
      "name image"
    );
    const productdata = await ProductModal.find({ active: true }).select(
      "name image"
    );
    const response: HomeDataResponse = {
      slidersData: sliderdata as MainSliderData[],
      categoryData: categorydata as categoryData[],
      productData: productdata as categoryData[],
    };

    return commonResponse(true, "", response, 200);
  } catch (error) {
    console.error(error);
    return commonResponse(false, "Failed to fetch Home data", error);
  }
};

export const POST = withAuth(GetSliders);
