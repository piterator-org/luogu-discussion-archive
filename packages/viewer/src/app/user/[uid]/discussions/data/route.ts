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
  const discussions = await prisma.discussion.findMany({
    select: selectDiscussionWithContent,
    where: {
      snapshots: { some: { authorId: uid } },
      id: { lt: cursor ? parseInt(cursor, 10) : undefined },
    },
    orderBy: { id: "desc" },
    take: NUM_PER_PAGE,
  });
  return NextResponse.json({
    data: await Promise.all(
      discussions.map(async (discussion) => ({
        ...discussion,
        ...(await serializeReply(discussion.id, {
          content: discussion.snapshots[0].content,
          time: discussion.time,
        })),
      }))
    ),
    nextCursor: discussions.length
      ? discussions[discussions.length - 1].id
      : null,
  });
}
