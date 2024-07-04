import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/(utils)/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req) => {
  const userID = req.user.id;

  //Example usage of Prisma client
  const userData = await prisma.user.findUnique({
    where: { id: userID },
    select: {
      id: true,
      email: true,
      name: true,
      profileImage: true,
    },
  });

  return NextResponse.json({ status: 200, userData });
};

export const GET = authMiddleware(handler);
