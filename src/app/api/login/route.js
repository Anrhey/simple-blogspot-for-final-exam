import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { comparePassword, signToken } from "../../(utils)/auth/auth";

const prisma = new PrismaClient();

export async function POST(req) {
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
