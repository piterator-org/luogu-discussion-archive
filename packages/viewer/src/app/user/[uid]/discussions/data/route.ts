import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getPost } from "@/lib/post";
import serializeReply from "@/lib/serialize-reply";
import { NUM_PER_PAGE } from "../../constants";

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } },
) {
  const uid = parseInt(params.uid, 10);
  const cursor = request.nextUrl.searchParams.get("cursor");
  const posts = await prisma.post.findMany({
    select: getPost.latestWithContent,
    where: {
      snapshots: { some: { authorId: uid } },
      takedown: { is: null },
      id: { lt: cursor ? parseInt(cursor, 10) : undefined },
    },
    orderBy: { id: "desc" },
    take: NUM_PER_PAGE,
  });
  return NextResponse.json({
    data: await Promise.all(
      posts.map(async (post) => ({
        ...post,
        ...(await serializeReply(post.id, {
          content: post.snapshots[0].content,
          time: post.time,
        })),
      })),
    ),
    nextCursor: posts.length ? posts[posts.length - 1].id : null,
  });
}
