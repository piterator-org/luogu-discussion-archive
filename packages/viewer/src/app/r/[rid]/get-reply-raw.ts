import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async (id: number) =>
  (await prisma.reply.findUnique({
    select: {
      id: true,
      author: true,
      time: true,
      content: true,
      discussion: {
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
