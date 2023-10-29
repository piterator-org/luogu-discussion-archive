import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; user: string } },
) {
  const postId = parseInt(params.id, 10);
  const authorId = parseInt(params.user, 10);

  const numReplies = await prisma.replySnapshot.count({
    where: { authorId, reply: { postId } },
  });

  return NextResponse.json({ numReplies });
}
