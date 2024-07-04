import { NextResponse } from "next/server";
import { verifyToken } from "../auth/auth";

export function authMiddleware(handler) {
  return async (req) => {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Attach user to request
    req.user = user;

    return handler(req);
  };
}

// Export default config to apply middleware to specific routes
export const config = {
  matcher: ["/api/authCheck", "/api/post/create"], // Apply to specific route or routes
};
