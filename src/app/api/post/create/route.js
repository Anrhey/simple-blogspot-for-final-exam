import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { authMiddleware } from "../../../(utils)/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req) => {
  const { title, content, imageUrl } = await req.json();
  const userID = req.user.id;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
        author: {
          connect: { id: userID },
        },
      },
    });

    console.log(post);

    return NextResponse.json(post);
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({ status: 200 });
};

export const POST = authMiddleware(handler);
