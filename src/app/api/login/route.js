import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import cors, { runMiddleware } from "../../(utils)/cors/cors";
import initMiddleware from "../../(lib)/init-middleware";
import { comparePassword, signToken } from "../../(utils)/auth/auth";

const prisma = new PrismaClient();

// const cors = initMiddleware(
//   Cors({
//     // Only allow requests with these methods
//     methods: ["GET", "POST", "OPTIONS"],
//     origin: "*", // Replace with your frontend URL or '*' to allow all origins
//   })
// );

const allowedOrigins = [
  "https://simple-blogspot-for-final-exam-ob5lak88j-anrheys-projects.vercel.app",
  "https://simple-blogspot-for-final-exam-k0l59qby8-anrheys-projects.vercel.app",
];

export async function POST(req) {
  //await cors(req, NextResponse); // Run the middleware
  //await runMiddleware(req, NextResponse, cors);
  // Set CORS headers to allow all origins
  NextResponse.setHeader("Access-Control-Allow-Credentials", true);
  NextResponse.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  NextResponse.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  NextResponse.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await comparePassword(password, user.password))) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = signToken({ id: user.id, email: user.email });
  return NextResponse.json({ token }, { status: 200 });
}
