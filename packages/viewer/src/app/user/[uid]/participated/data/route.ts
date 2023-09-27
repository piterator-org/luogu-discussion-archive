import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getPost } from "@/lib/post";
import serializeReply from "@/lib/serialize-reply";
import { getReply } from "@/lib/reply";
import { NUM_PER_PAGE } from "../../constants";

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } },
) {
  const uid = parseInt(params.uid, 10);
  const cursor = request.nextUrl.searchParams.get("cursor");
  const discussions = await prisma.post
    .findMany({
      select: {
        ...getPost.latestWithContent,
        replies: {
          where: {
            snapshots: { some: { authorId: uid } },
          },
          select: getReply.latestWithContent,
          orderBy: { id: "asc" },
        },
      },
      where: {
        OR: [
          { replies: { some: { snapshots: { some: { authorId: uid } } } } },
          { snapshots: { some: { authorId: uid } } },
        ],
        takedown: { is: null },
        id: { lt: cursor ? parseInt(cursor, 10) : undefined },
      },
      orderBy: { id: "desc" },
      take: NUM_PER_PAGE,
    })
    .then((d) =>
      Promise.all(
        d.map(async (discussion) => ({
          ...discussion,
          ...(await serializeReply(discussion.id, {
            content: discussion.snapshots[0].content,
            time: discussion.time,
          })),
          replies: await Promise.all(
            discussion.replies.map(async (reply) => ({
              ...reply,
              ...(await serializeReply(discussion.id, reply)),
            })),
          ),
        })),
      ),
    );
  return NextResponse.json({
    data: discussions,
    nextCursor: discussions.length
      ? discussions[discussions.length - 1].id
      : null,
  });
}
