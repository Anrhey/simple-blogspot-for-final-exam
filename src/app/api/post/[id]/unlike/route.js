import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/(utils)/middleware/auth";

const prisma = new PrismaClient();

const unlikeHandler = async (req) => {
  const { postId } = await req.json();
  const userID = req.user.id;

  try {
    const unlike = await prisma.like.deleteMany({
      where: {
        userId: userID,
        postId: postId,
      },
    });

    return NextResponse.json(unlike);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error unliking post" }, { status: 500 });
  }
};

export const POST = authMiddleware(unlikeHandler);
