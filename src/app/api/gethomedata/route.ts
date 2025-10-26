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
      toDate: { $gte: today },
      active: true,
    })
      .sort({ fromDate: 1 })
      .select("title description image _id");

    const categorydata = await CategoryModal.find({ active: true }).select(
      "name image _id"
    );
    const productdata = await ProductModal.find({ active: true }).select(
      "name image _id stock price"
    );
    const response: HomeDataResponse = {
      slidersData: sliderdata?.map((item) => {
        return {
          id: item?._id?.toString() || "",
          title: item?.title || "",
          description: item?.description || "",
          image: item?.image || "",
        };
      }),
      categoryData: categorydata?.map((item) => {
        return {
          id: item?._id?.toString() || "",
          name: item?.name || "",
          image: item?.image || "",
        };
      }),
      productData: productdata?.map((item) => {
        return {
          id: item?._id?.toString() || "",
          name: item?.name || "",
          image: item?.image || "",
          price: item?.price || 0,
          rating: item?.averageRating || 0,
          stock: item?.stock || 0,
        };
      }),
    };

    return commonResponse(true, "", response, 200);
  } catch (error) {
    console.error(error);
    return commonResponse(false, "Failed to fetch Home data", error);
  }
};

export const POST = withAuth(GetSliders);
