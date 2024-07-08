import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { authMiddleware } from "../../../(utils)/middleware/auth";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

const handler = async (req) => {
  const userID = req.user.id;

  //Example usage of Prisma client
  try {
    const userData = await prisma.user.findUnique({
      where: { id: userID },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        posts: {
          include: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json({ status: 200, userData });
  } catch (error) {
    return NextResponse.json({ error });
  }
};

export const GET = authMiddleware(handler);
