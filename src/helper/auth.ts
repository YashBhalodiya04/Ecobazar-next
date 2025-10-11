import jwt from "jsonwebtoken"; // or any lib you use

const SECRET = process.env.JWT_TOKEN || "supersecret";

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    return null;
  }
}


// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { verifyToken } from "./helper/auth";
// import { commonResponse } from "./helper/commonResponbeen";

// export async function middleware(req: NextRequest) {
//   if (req.nextUrl.pathname.startsWith("/api")) {
//     try {
//       const token = req.headers.get("authorization")?.replace("Bearer ", "");

//       if (!token || !verifyToken(token)) {
//         return commonResponse(false, "Unauthorized access", null, 401);
//       }
//     } catch (err) {
//       console.error("Middleware error:", err);
//       return commonResponse(false, "Invalid token", null, 500);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/api/auth/:path*"],
// };
