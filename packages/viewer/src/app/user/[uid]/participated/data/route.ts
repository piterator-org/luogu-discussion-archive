import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { selectDiscussionWithContent } from "@/lib/discussion";
import serializeReply from "@/lib/serialize-reply";
import { NUM_PER_PAGE } from "../../constants";

// eslint-disable-next-line import/prefer-default-export
export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  const uid = parseInt(params.uid, 10);
  const cursor = request.nextUrl.searchParams.get("cursor");
  const discussions = await prisma.discussion
    .findMany({
      select: {
        ...selectDiscussionWithContent,
        replies: { where: { authorId: uid }, orderBy: { id: "asc" } },
      },
      where: {
        OR: [
          { replies: { some: { authorId: uid } } },
          { snapshots: { some: { authorId: uid } } },
        ],
        id: { lt: cursor ? parseInt(cursor, 10) : undefined },
      },
      orderBy: { id: "desc" },
      take: NUM_PER_PAGE,
    })
    .then((d) =>
      Promise.all(
        d.map(async (discussion) => ({
          ...discussion,
          replies: await Promise.all(
            discussion.replies.map(async (reply) => ({
              ...reply,
              ...(await serializeReply(discussion.id, reply)),
            }))
          ),
        }))
      )
    );
  return NextResponse.json({
    data: discussions,
    nextCursor: discussions.length
      ? discussions[discussions.length - 1].id
      : null,
  });
}
