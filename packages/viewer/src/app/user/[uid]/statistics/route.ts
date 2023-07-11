import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  const uid = parseInt(params.uid, 10);
  const [discussions, replies] = await Promise.all([
    prisma.discussion.count({
      where: { snapshots: { some: { authorId: uid } } },
    }),
    prisma.reply.count({ where: { authorId: uid } }),
  ]);
  return NextResponse.json({ discussions, replies });
}
