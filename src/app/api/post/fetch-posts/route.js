import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/(utils)/middleware/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    console.log(posts);

    return NextResponse.json(posts);
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({ status: 200 });
}
