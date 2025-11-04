import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import { toObjectId } from "@/lib/helper";
import UserModal from "@/model/User";
import { NextRequest } from "next/server";

export const SaveProfileDetail = async (
  req: NextRequest,
  context: ContexInterface,
  body: any
) => {
  await dbconnect();

  try {
    const userid = toObjectId(context?.user?.id);
    const payload = await req.json();

    const { username, email, phone, userimage, billingAddress } = payload;

    if (!username || !email || !phone) {
      return commonResponse(false, "Missing required fields", "", 400);
    }

    const updatedUser = await UserModal.findByIdAndUpdate(
      userid,
      {
        $set: {
          username,
          email,
          phone,
          userimage,
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
      return commonResponse(false, "User not found", "", 404);
    }

    return commonResponse(
      true,
      "Profile updated successfully",
      updatedUser,
      200
    );
  } catch (error) {
    console.error("Error saving user profile:", error);
    return commonResponse(false, "Failed to save user profile", error, 500);
  }
};

export const POST = withAuth(SaveProfileDetail);
