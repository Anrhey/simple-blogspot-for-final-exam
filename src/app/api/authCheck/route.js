import { NextResponse } from "next/server";
import { authMiddleware } from "../../(utils)/middleware/auth";

//const prisma = new PrismaClient();

const handler = async (req) => {
  const userID = req.user.id;

  // Example usage of Prisma client
  //   const userData = await prisma.user.findUnique({
  //     where: { id: user.id },
  //   });

  return NextResponse.json({ status: 200, userID });
};

export const GET = authMiddleware(handler);
