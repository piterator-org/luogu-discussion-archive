import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { selectDiscussionWithContent } from "@/lib/discussion";
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
    data: discussions,
    nextCursor: discussions.length
      ? discussions[discussions.length - 1].id
      : null,
  });
}
