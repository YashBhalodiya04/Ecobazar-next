import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import dbconnect from "@/lib/dbConnect";
import { toObjectId } from "@/lib/helper";
import UserModal from "@/model/User";
import { NextRequest } from "next/server";

export const GetUserProfile = async (
  req: NextRequest,
  context: ContexInterface,
  body: any
) => {
  await dbconnect();
  try {
    const userid = toObjectId(context?.user?.id);

    const UserData = await UserModal.findById(userid).select(
      "username email phone userimage billingAddress"
    );

    if (!UserData) {
      return commonResponse(false, "User not found", "", 200);
    }

    const user = UserData.toObject();

    const formattedUser = {
      username: user.username,
      email: user.email,
      phone: user.phone,
      userimage: user.userimage,
      billingAddress: user.billingAddress?.map((addr: any) => ({
        firstName: addr.firstName,
        lastName: addr.lastName,
        address: addr.address,
        city: addr.city,
        state: addr.state,
        zipCode: addr.zipCode,
        country: addr.country,
        phoneNumber: addr.phoneNumber,
        isPrimary: addr.isPrimary ?? false,
      })),
    };

    return commonResponse(true, "", formattedUser, 200);
  } catch (error) {
    console.error("Error getting user profile:", error);
    return commonResponse(false, "Failed to get user profile", error, 500);
  }
};

export const POST = withAuth(GetUserProfile);
