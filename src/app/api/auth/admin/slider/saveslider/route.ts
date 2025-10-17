import { commonResponse } from "@/helper/commonResponbeen";
import { parseFormDataWithFiles } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import { MainSliderPayload } from "@/interfaces/MainSliderInterface";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import dbconnect from "@/lib/dbConnect";
import { toObjectId } from "@/lib/helper";
import MainSliderModal, { MainSlider } from "@/model/MainSlider";
import dayjs from "dayjs";
import { NextRequest } from "next/server";

export const SaveSlider = async (
  req: NextRequest,
  context: ContexInterface,
  body: FormData
) => {
  await dbconnect();
  try {
    if (!context?.user?.isadmin) {
      return commonResponse(false, "You are not authorized", "", 401);
    }
    const { data, files } = parseFormDataWithFiles<MainSliderPayload>(body);
    if (!validatePayload(data) || (files?.length === 0 && !data?.imagepath)) {
      return commonResponse(false, "Please Fill All Fields", "", 200);
    }
    let duplicate: any;
    if (!data?.sliderid) {
      duplicate = await MainSliderModal.findOne({
        title: data.title,
        active: true,
      });
    } else {
      const sliderId = toObjectId(data?.sliderid);
      if (!sliderId) {
        return commonResponse(false, "Invalid slider ID", "", 200);
      }

      duplicate = await MainSliderModal.findOne({
        title: data.title,
        _id: { $ne: sliderId },
        active: true,
      });

      const isExistSlider = await MainSliderModal.findById(sliderId);
      if (!isExistSlider) {
        return commonResponse(false, "Slider not found", "", 404);
      }
    }

    if (duplicate) {
      return commonResponse(false, "Slider title already exists", "", 200);
    }

    const fromDate = dayjs(data.fromdate);
    const toDate = dayjs(data.todate);

    if (!fromDate.isValid() || !toDate.isValid()) {
      return commonResponse(false, "Invalid date format", "", 400);
    }

    if (fromDate.isAfter(toDate)) {
      return commonResponse(
        false,
        "'From Date' cannot be after 'To Date'",
        "",
        400
      );
    }

    // ✅ Check overlap
    const overlapQuery: any = {
      fromDate: { $lte: toDate.toDate() },
      to: { $gte: fromDate.toDate() },
      active: true,
    };

    if (data.sliderid) overlapQuery._id = { $ne: toObjectId(data.sliderid) };

    const overlappingSlider = await MainSliderModal.findOne(overlapQuery);
    if (overlappingSlider) {
      return commonResponse(
        false,
        `Another slider (${overlappingSlider.title}) already exists in this date range.`,
        "",
        200
      );
    }

    // ✅ Upload or reuse image
    let imgurl: string = data.imagepath || "";
    if (files?.length > 0) {
      imgurl = await uploadToCloudinary(files[0], "home-slider");
    }

    // Create or update
    if (!data.sliderid) {
      const slider = new MainSliderModal({
        title: data.title,
        description: data.description,
        image: imgurl,
        fromDate: fromDate.toDate(),
        to: toDate.toDate(),
        user: toObjectId(context?.user?.id),
        active: true,
      });
      await slider.save();
      return commonResponse(true, "", "Slider created successfully", 200);
    } else {
      const sliderId = toObjectId(data.sliderid);
      await MainSliderModal.findByIdAndUpdate(sliderId, {
        title: data.title,
        description: data.description,
        image: imgurl,
        fromDate: fromDate.toDate(),
        to: toDate.toDate(),
        active: true,
      });
      return commonResponse(true, "", "Slider updated successfully", 200);
    }
  } catch (error) {
    console.error(error);
    return commonResponse(false, "Failed to save slider", error);
  }
};

export const POST = withAuth(SaveSlider);

const validatePayload = (body: MainSliderPayload): boolean => {
  const { title, description, fromdate, todate } = body;
  const fromDate = dayjs(fromdate);
  const toDate = dayjs(todate);
  if (
    !title?.trim() ||
    !description?.trim() ||
    !fromDate.isValid() ||
    !toDate.isValid()
  ) {
    return false;
  }
  return true;
};
