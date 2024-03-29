import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { selectUser } from "@/lib/user";
import { NUM_PER_PAGE } from "../../constants";

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } },
) {
  const uid = parseInt(params.uid, 10);
  const cursor = request.nextUrl.searchParams.get("cursor");
  const judgements = await prisma.judgement.findMany({
    select: {
      time: true,
      user: { select: selectUser.withLatest },
      permissionGranted: true,
      permissionRevoked: true,
      reason: true,
    },
    where: {
      userId: uid,
      time: { lt: cursor ?? undefined },
    },
    orderBy: { time: "desc" },
    take: NUM_PER_PAGE,
  });
  return NextResponse.json({
    data: judgements,
    nextCursor: judgements.length
      ? judgements[judgements.length - 1].time.toISOString()
      : null,
  });
}
