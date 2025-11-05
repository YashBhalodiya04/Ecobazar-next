import { commonResponse } from "@/helper/commonResponbeen";
import { parseFormDataWithFiles } from "@/helper/CommonUtils";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import { SaveUserProfilePayload } from "@/interfaces/UserCartInterface";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import dbconnect from "@/lib/dbConnect";
import { toObjectId } from "@/lib/helper";
import UserModal from "@/model/User";
import { NextRequest } from "next/server";

export const SaveProfileDetail = async (
  req: NextRequest,
  context: ContexInterface,
  body: FormData
) => {
  await dbconnect();

  try {
    const userid = toObjectId(context?.user?.id);

    const { data, files } =
      parseFormDataWithFiles<SaveUserProfilePayload>(body);

    const { username, email, phone, userimage, billingAddress } = data;

    if (!username || !email || !phone) {
      return commonResponse(false, "Missing required fields", "", 400);
    }
    let imgurl: string = userimage || "";
    if (files?.length > 0) {
      imgurl = await uploadToCloudinary(files[0], "userprofile");
    }

    const updatedUser = await UserModal.findByIdAndUpdate(
      userid,
      {
        $set: {
          username,
          email,
          phone,
          userimage: imgurl,
          billingAddress,
        },
      },
      {
        new: true,
        runValidators: true,
        select: "username email phone userimage billingAddress",
      }
    );

    if (!updatedUser) {
      return commonResponse(false, "User not found", "", 200);
    }

    return commonResponse(true, "Profile updated successfully", "", 200);
  } catch (error) {
    console.error("Error saving user profile:", error);
    return commonResponse(false, "Failed to save user profile", error, 500);
  }
};

export const POST = withAuth(SaveProfileDetail);
