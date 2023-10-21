import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

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
      takedown: {
        select: {
          submitter: {
            select: {
              id: true,
              username: true,
            },
          },
          reason: true,
        },
      },
    },
    where: { id },
  })) ?? notFound();
