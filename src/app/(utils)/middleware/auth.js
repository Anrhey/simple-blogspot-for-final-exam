// // authMiddleware.js
// import jwt from "jsonwebtoken";

// export const authMiddleware = (handler) => async (req, res, params) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach decoded user to request object
//     return handler(req, res, params);
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

import { NextResponse } from "next/server";
import { verifyToken } from "../auth/auth";

export function authMiddleware(handler) {
  return async (req, params) => {
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

    return handler(req, params);
  };
}
