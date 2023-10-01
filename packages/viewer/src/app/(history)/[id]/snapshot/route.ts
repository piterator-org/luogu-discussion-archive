import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const postId = parseInt(params.id, 10);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const timestamp = parseFloat(request.nextUrl.searchParams.get("time")!);
  if (Number.isNaN(timestamp)) return NextResponse.json({}, { status: 400 });
  const time = new Date(timestamp);
  const snapshot =
    (await prisma.postSnapshot.findUnique({
      where: { postId_time: { postId, time } },
    })) ?? notFound();
  const next = await prisma.postSnapshot.findFirst({
    select: { time: true },
    where: { postId, time: { gt: time } },
  });
  const previous = await prisma.postSnapshot.findFirst({
    select: { time: true },
    where: { postId, time: { lt: time } },
  });
  return NextResponse.json({ snapshot, next, previous });
}
