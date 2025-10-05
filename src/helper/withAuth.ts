import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/helper/auth";
import { commonResponse } from "@/helper/commonResponbeen";
import { equal } from "assert";

export function withAuth(handler: Function) {
  return async (req: NextRequest, context: any) => {
    try {
      if (req.nextUrl.pathname.startsWith("/api/auth")) {
        const token = req.headers.get("authorization")?.replace("Bearer ", "");
        if (!token || !verifyToken(token)) {
          return commonResponse(false, "Unauthorized access", null, 401);
        }
      }

      let body: any = null;

      if (req.method === "POST") {
        const rawBody = await req.json();
        body = { ...rawBody, injected: "from wrapper" };
      }
      return handler(req, context, body);
    } catch (err) {
      console.error("Auth wrapper error:", err);
      return commonResponse(false, "Auth failed", null, 500);
    }
  };
}
