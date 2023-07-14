import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const discussionId = parseInt(params.id, 10);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const timestamp = parseFloat(request.nextUrl.searchParams.get("time")!);
  if (Number.isNaN(timestamp)) return NextResponse.json({}, { status: 400 });
  const time = new Date(timestamp);
  const snapshot =
    (await prisma.snapshot.findUnique({
      where: { discussionId_time: { discussionId, time } },
    })) ?? notFound();
  const next = await prisma.snapshot.findFirst({
    select: { time: true },
    where: { discussionId, time: { gt: time } },
  });
  const previous = await prisma.snapshot.findFirst({
    select: { time: true },
    where: { discussionId, time: { lt: time } },
  });
  return NextResponse.json({ snapshot, next, previous });
}
