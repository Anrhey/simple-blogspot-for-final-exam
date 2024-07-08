import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const handler = async (req, { params }) => {
  const id = params.id;
  //const userID = req.user.id;

  //Example usage of Prisma client
  const userData = await prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      email: true,
      name: true,
      profileImage: true,
      posts: true,
    },
  });

  return NextResponse.json({ status: 200, userData });
};

export const GET = handler;
