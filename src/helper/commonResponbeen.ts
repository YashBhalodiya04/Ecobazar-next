import encryptDecryptUtil from "@/lib/encrypt-decrypt-utils";
import { cookies } from "next/headers";

export const commonResponse = async (
  success: boolean,
  message: string,
  data: any = null,
  status: number = 200
) => {
  if (status === 401) {
    (await cookies()).delete("token");
    (await cookies()).delete("user");
  }
  const newbody = encryptDecryptUtil.encryptData(JSON.stringify(data || ""));
  return Response.json(
    {
      success,
      message,
      data: newbody,
      statuscode: status,
    },
    { status }
  );
};
