import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { hashPassword } from "../../(utils)/auth/auth";

const prisma = new PrismaClient();

export async function POST(req) {
  const { email, name, password } = await req.json();
  const hashedPassword = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    return NextResponse.json(user);
    //return NextResponse.json({ message: "User registered successfully", user });
  } catch (error) {
    return NextResponse.json({ message: "Error registering user", error });
  }
}
