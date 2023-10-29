import { NextResponse, type NextRequest } from "next/server";
import { getReply, selectReply } from "@/lib/reply";
import prisma from "@/lib/prisma";
import { NUM_PER_PAGE } from "../../constants";

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } },
) {
  const uid = parseInt(params.uid, 10);
  const cursor = request.nextUrl.searchParams.get("cursor");
  const replies = await prisma.reply.findMany({
    select: {
      ...getReply.latestWithContent,
      ...selectReply.withPostMeta,
      // postId: undefined,
    },
    where: {
      post: { takedown: { is: null } },
      takedown: { is: null },
      id: { lt: cursor ? parseInt(cursor, 10) : undefined },
      snapshots: {
        some: {
          authorId: uid,
        },
      },
    },
    orderBy: { id: "desc" },
    take: NUM_PER_PAGE,
  });
  // .then((r) =>
  //   r.map(async (reply) => ({
  //     ...reply,
  //     ...(await serializeReply(reply.post.id, reply.snapshots[0])),
  //   })),
  // )
  // .then((r) => Promise.all(r));
  return NextResponse.json({
    data: replies,
    nextCursor: replies.length ? replies[replies.length - 1].id : null,
  });
}
