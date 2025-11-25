import { corsHeaders } from "@/lib/cors";
import encryptDecryptUtil from "@/lib/encrypt-decrypt-utils";
import { cookies } from "next/headers";

export const commonResponse = async (
  // req: Request, 
  success: boolean,
  message: string,
  data: any = null,
  status: number = 200
) => {
  if (status === 401) {
    (await cookies()).delete("token");
    (await cookies()).delete("user");
  }
  // let newbody = "";
  // const isPostman = req.headers.get("postman-token") ? true : false;
  // if (isPostman) {
  //   newbody = data;
  // } else {
  //   newbody = encryptDecryptUtil.encryptData(JSON.stringify(data || ""));
  // }

  const returndata = encryptDecryptUtil.encryptData(JSON.stringify(data || ""));
  return Response.json(
    {
      success,
      message,
      data: returndata,
      statuscode: status,
    },
    { status, headers: corsHeaders() }
  );
};
