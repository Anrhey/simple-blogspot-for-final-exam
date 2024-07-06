import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/(utils)/middleware/auth";

const prisma = new PrismaClient();

const likeHandler = async (req, { params }) => {
  const id = params.id;
  const userId = req.user.id;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId: userId,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json({ message: "User already liked the post" });
    }
    const likePost = await prisma.like.create({
      data: {
        postId: id,
        userId: userId,
      },
    });
    return NextResponse.json(likePost);
  } catch (error) {
    console.error(error);
    return NextResponse.error({
      status: 500,
      message: "Internal Server Error",
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const PUT = authMiddleware(likeHandler);
