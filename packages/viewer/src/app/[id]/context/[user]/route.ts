import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import serializeReply from "@/lib/serialize-reply";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; user: string } },
) {
  const discussionId = parseInt(params.id, 10);
  const authorId = parseInt(params.user, 10);
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const replyId = parseInt(request.nextUrl.searchParams.get("reply")!, 10);
  const offset = parseInt(request.nextUrl.searchParams.get("offset")!, 10);
  /* eslint-enable @typescript-eslint/no-non-null-assertion */
  const reply = await (offset <= 0
    ? prisma.reply.findFirst({
        select: {
          id: true,
          author: true,
          time: true,
          content: true,
          discussionId: true,
          takedown: {
            select: {
              submitter: {
                select: {
                  id: true,
                  username: true,
                },
              },
              reason: true,
            },
          },
        },
        where: { discussionId, authorId, id: { lt: replyId } },
        orderBy: { id: "desc" },
        skip: -offset,
      })
    : prisma.reply.findFirst({
        select: {
          id: true,
          author: true,
          time: true,
          content: true,
          discussionId: true,
          takedown: {
            select: {
              submitter: {
                select: {
                  id: true,
                  username: true,
                },
              },
              reason: true,
            },
          },
        },
        where: { discussionId, authorId, id: { gt: replyId } },
        orderBy: { id: "asc" },
        skip: offset - 1,
      }));
  if (reply)
    return NextResponse.json({
      ...reply,
      ...(await serializeReply(discussionId, reply)),
    });
  return NextResponse.json({});
}
