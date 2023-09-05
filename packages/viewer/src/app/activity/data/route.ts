import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

const ACTIVITIES_PER_PAGE = parseInt(
  process.env.ACTIVITIES_PER_PAGE ?? "10",
  10,
);

export async function GET(request: NextRequest) {
  const cursor = request.nextUrl.searchParams.get("cursor");
  const activities = await prisma.activity.findMany({
    select: {
      id: true,
      time: true,
      user: { select: { user: true } },
      content: true,
    },
    orderBy: { id: "desc" },
    cursor: cursor ? { id: parseInt(cursor, 10) } : undefined,
    skip: 1,
    take: ACTIVITIES_PER_PAGE,
  });
  return NextResponse.json({
    data: activities,
    nextCursor: activities[activities.length - 1]?.id ?? null,
  });
}
