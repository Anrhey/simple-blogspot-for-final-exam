import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/(utils)/middleware/auth";

const prisma = new PrismaClient();

const likeHandler = async (req, { params }) => {
  const id = params.id;
  const userID = req.user.id;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: { postId: id, userId: userID },
      },
    });

    if (existingLike) {
      const updatedLike = await prisma.like.update({
        where: {
          likeId: existingLike.likeId,
        },
        data: {
          isLiked: !existingLike.isLiked,
        },
      });
      return NextResponse.json(updatedLike);
    } else {
      const newLike = await prisma.like.create({
        data: {
          postId: id,
          userId: userID,
          isLiked: true,
        },
      });
      return NextResponse.json(newLike);
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error toggling like" }, { status: 500 });
  }
};

export const POST = authMiddleware(likeHandler);
