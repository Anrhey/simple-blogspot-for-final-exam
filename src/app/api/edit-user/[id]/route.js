import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { authMiddleware } from "../../../(utils)/middleware/auth";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

async function putHandler(req, { params }) {
  const id = params.id;
  const { name, profileImage } = await req.json();

  try {
    const updateUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        profileImage,
      },
    });

    console.log(updateUser);
    return NextResponse.json(updateUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error occurred while updating the post." },
      { status: 500 }
    );
  }
}

export const PUT = authMiddleware(putHandler);
