import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } },
) {
  const userId = +params.uid;
  const limit = request.nextUrl.searchParams.get("limit") ?? 10;
  const offset = request.nextUrl.searchParams.get("offset");

  // 按照时间降序排序 跳过 offset 个
  const snapshots = await prisma.userSnapshot.findMany({
    where: {
      userId,
      time: { lt: offset ? new Date(offset) : undefined },
    },
    orderBy: { time: "desc" },
    take: limit ? +limit : undefined,
  });

  return NextResponse.json({
    snapshots,
    nextCursor: snapshots[snapshots.length - 1]?.time ?? null,
  });
}
