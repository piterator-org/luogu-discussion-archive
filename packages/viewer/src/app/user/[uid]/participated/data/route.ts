import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getPost } from "@/lib/post";
import { getReply } from "@/lib/reply";
import { NUM_PER_PAGE } from "../../constants";

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } },
) {
  const uid = parseInt(params.uid, 10);
  const cursor = request.nextUrl.searchParams.get("cursor");
  const posts = await prisma.post.findMany({
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
  });
  return NextResponse.json({
    data: posts,
    nextCursor: posts.length ? posts[posts.length - 1].id : null,
  });
}
