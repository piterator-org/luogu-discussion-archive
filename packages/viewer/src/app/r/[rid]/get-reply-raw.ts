import { selectPost } from "@/lib/post";
import prisma from "@/lib/prisma";
import { selectReply } from "@/lib/reply";

export default async (id: number) =>
  prisma.reply.findUnique({
    select: {
      ...selectReply.withLatestContent,
      ...selectReply.withTakedown,
      ...selectReply.withBasic,
      postId: undefined,
      post: {
        select: {
          id: true,
          ...selectPost.withLatestSnapshotMeta,
          ...selectPost.withTakedown,
        },
      },
    },
    where: { id },
  });
