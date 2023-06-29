import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

const REPLIES_PER_PAGE = parseInt(process.env.REPLIES_PER_PAGE ?? "10", 10);

export default async function Page({ params }: { params: { rid: string } }) {
  const id = parseInt(params.rid, 10);
  if (Number.isNaN(id)) notFound();
  const { discussionId } =
    (await prisma.reply.findUnique({
      select: { discussionId: true },
      where: { id },
    })) ?? notFound();
  const pages = Math.ceil(
    (await prisma.reply.count({
      where: { id: { lte: id }, discussionId },
    })) / REPLIES_PER_PAGE
  );
  return redirect(`/${discussionId}/${pages}#${params.rid}`);
}
