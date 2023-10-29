import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { selectUser } from "@/lib/user";
import { notFound } from "next/navigation";

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } },
) {
  const uid = parseInt(params.uid, 10);
  const user =
    (await prisma.user.findUnique({
      where: { id: uid },
      select: selectUser.withLatest,
    })) ?? notFound();
  return NextResponse.json(user);
}
