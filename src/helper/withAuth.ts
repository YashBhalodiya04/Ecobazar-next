import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/helper/auth";
import { commonResponse } from "@/helper/commonResponbeen";
import { JWtUserInterface } from "@/interfaces/commonInterace";

export function withAuth(handler: Function) {
  return async (req: NextRequest, context: any) => {
    try {
      let user: JWtUserInterface | null = null;
      const token = req.cookies.get("token")?.value;
      if (token) {
        const verified = verifyToken(token);
        if (verified) {
          user = verified as JWtUserInterface;
        }
      }
      if (req.nextUrl.pathname.startsWith("/api/auth")) {
        // const authHeader = req.headers.get("authorization");
        // if (!authHeader || !authHeader.startsWith("Bearer ")) {
        //   return commonResponse(false, "Unauthorized access", "", 401);
        // }
        if (!token || !user) {
          return commonResponse(false, "Invalid token", "", 401);
        }
      }

      let body = {};
      // ✅ safely parse only if content-type is JSON and body exists
      if (["POST", "PUT", "PATCH"].includes(req.method)) {
        const contentType = req.headers.get("content-type") || "";
        try {
          if (contentType.includes("application/json")) {
            const text = await req.text();
            body = text ? JSON.parse(text) : {};
          } else if (contentType.includes("multipart/form-data")) {
            const clonedReq = req.clone();
            body = await clonedReq.formData();
          }
        } catch (err) {
          console.error("Error parsing body:", err);
          body = {};
        }
      }
      //  console.log(body)
      // Pass decoded user info to handler
      return handler(req, { ...context, user: user }, body);
    } catch (err) {
      console.error("Auth wrapper error:", err);
      return commonResponse(false, "Auth failed", "", 500);
    }
  };
}
