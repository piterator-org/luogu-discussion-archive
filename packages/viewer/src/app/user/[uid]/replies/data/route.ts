import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import serializeReply from "@/lib/serialize-reply";
import { NUM_PER_PAGE } from "../../constants";

// eslint-disable-next-line import/prefer-default-export
export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  const uid = parseInt(params.uid, 10);
  const cursor = request.nextUrl.searchParams.get("cursor");
  const replies = await prisma.reply
    .findMany({
      select: {
        id: true,
        time: true,
        author: true,
        content: true,
        discussion: {
          select: {
            id: true,
            snapshots: {
              select: { title: true, authorId: true },
              orderBy: { time: "desc" },
              take: 1,
            },
          },
        },
      },
      where: {
        authorId: uid,
        id: { lt: cursor ? parseInt(cursor, 10) : undefined },
      },
      orderBy: { id: "desc" },
      take: NUM_PER_PAGE,
    })
    .then((r) =>
      r.map(async (reply) => ({
        ...reply,
        ...(await serializeReply(reply.discussion.id, reply)),
      }))
    )
    .then((r) => Promise.all(r));
  return NextResponse.json({
    data: replies,
    nextCursor: replies.length ? replies[replies.length - 1].id : null,
  });
}
