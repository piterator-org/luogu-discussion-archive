import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import serializeReply from "@/lib/serialize-reply";

import { selectReply } from "@/lib/reply";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id, 10);
  const cursor = request.nextUrl.searchParams.get("cursor");
  const limit = request.nextUrl.searchParams.get("limit");
  const replies = await prisma.reply.findMany({
    select: {
      ...selectReply.withBasic,
      ...selectReply.withTakedown,
      ...selectReply.withLatestContent,
    },
    where: {
      postId: id,
      id: { gt: cursor ? parseInt(cursor, 10) : undefined },
    },
    take: parseInt(limit ?? "10", 10),
  });
  return NextResponse.json({
    data: await Promise.all(
      replies.map(async (reply) => ({
        ...reply,
        ...(await serializeReply(id, reply)),
      })),
    ),
    nextCursor: replies.length ? replies[replies.length - 1].id : null,
  });
}
