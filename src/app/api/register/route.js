import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { hashPassword } from "../../(utils)/auth/auth";
import cors from "../../(utils)/cors/cors";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function POST(req) {
  const { email, name, password, profileImage } = await req.json();

  if (!email || !name || !password) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const hashedPassword = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        profileImage,
      },
    });
    return NextResponse.json(user);
    //return NextResponse.json({ message: "User registered successfully", user });
  } catch (error) {
    return NextResponse.json({ message: "Error registering user", error });
  }
}
