import { commonResponse } from "@/helper/commonResponbeen";
import { isNullEmpty } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import {
  CommonDeletePayloadInterface,
  ContexInterface,
} from "@/interfaces/commonInterace";
import { toObjectId } from "@/lib/helper";
import MainSliderModal from "@/model/MainSlider";
import { NextRequest } from "next/server";

export const DeleteSlider = async (
  req: NextRequest,
  context: ContexInterface,
  body: CommonDeletePayloadInterface
) => {
  try {
    if (!context?.user?.isadmin) {
      return commonResponse(false, "You are not authorized", "", 401);
    }

    if (isNullEmpty(body?.id)) {
      return commonResponse(false, "Slider ID is required");
    }
    const sliderID = toObjectId(body?.id);
    const slider = await MainSliderModal.findById({ _id: sliderID });
    if (!slider) {
      return commonResponse(false, "Slider not found");
    }

    const activeCount = await MainSliderModal.countDocuments({ active: true });

    if (activeCount <= 1 && slider.active) {
      return commonResponse(
        false,
        "At least one slider must remain active. You cannot deactivate all sliders."
      );
    }

    await MainSliderModal.findByIdAndUpdate(sliderID, { active: false });

    return commonResponse(true, "Slider deleted successfully");
  } catch (error) {
    console.error(error);
    return commonResponse(false, "Error On Delete Slider", error);
  }
};

export const POST = withAuth(DeleteSlider);
