import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } },
) {
  const uid = parseInt(params.uid, 10);
  const [discussions, replies, judgements] = await Promise.all([
    prisma.post.count({
      where: { snapshots: { some: { authorId: uid } } },
    }),
    prisma.reply.count({ where: { snapshots: { some: { authorId: uid } } } }),
    prisma.judgement.count({ where: { userId: uid } }),
  ]);
  return NextResponse.json({ discussions, replies, judgements });
}
