import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { selectReply } from "@/lib/reply";

export default async (id: number) =>
  (await prisma.reply.findUnique({
    select: {
      ...selectReply.withLatestContent,
      ...selectReply.withTakedown,
      ...selectReply.withBasic,
      postId: undefined,
      post: {
        select: {
          id: true,
          snapshots: {
            select: { title: true, authorId: true },
            orderBy: { time: "desc" },
            take: 1,
          },
        },
      },
    },
    where: { id },
  })) ?? notFound();
