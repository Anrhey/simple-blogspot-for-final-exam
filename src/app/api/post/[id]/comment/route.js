import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/(utils)/middleware/auth";

const prisma = new PrismaClient();

const postHandler = async (req) => {
  const { comment_content, postId } = await req.json();
  const userID = req.user.id;

  try {
    const comment = await prisma.comment.create({
      data: {
        comment_content: comment_content,
        author: {
          connect: { id: userID },
        },
        post: {
          connect: { postId: postId },
        },
      },
    });

    console.log(comment);

    return NextResponse.json(comment);
  } catch (error) {
    console.log(error);
  }
};

export const POST = authMiddleware(postHandler);
