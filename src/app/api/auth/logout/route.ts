import { commonResponse } from "@/helper/commonResponbeen";
import { withAuth } from "@/helper/withAuth";
import { ContexInterface } from "@/interfaces/commonInterace";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const Logout = async (
  req: NextRequest,
  context: ContexInterface,
  body: any
) => {
  try {
    (await cookies()).delete("token");
    (await cookies()).delete("user");
    return commonResponse(true, "Logged out successfully", {}, 200);
  } catch (error) {
    console.error(error);
    return commonResponse(false, "Failed to Logout", error);
  }
};

export const POST = withAuth(Logout);
