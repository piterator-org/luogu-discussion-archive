import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import serializeReply from "@/lib/serialize-reply";
import Reply from "@/components/replies/Reply";

export default async function Page({ params }: { params: { uid: string } }) {
  const uid = parseInt(params.uid, 10);
  if (Number.isNaN(uid)) notFound();
  const replies = await prisma.reply
    .findMany({
      select: {
        id: true,
        time: true,
        author: true,
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
      where: { authorId: uid },
      orderBy: { id: "desc" },
    })
    .then((r) =>
      r.map(async (reply) => ({
        ...reply,
        ...(await serializeReply(
          reply.discussion.snapshots[0].authorId,
          reply
        )),
      }))
    )
    .then((r) => Promise.all(r));

  return replies.map((reply) => (
    <>
      <Link href={`/${reply.discussion.id}`}>
        {reply.discussion.snapshots[0].title}
      </Link>
      <Reply
        reply={reply}
        discussion={{
          id: reply.discussion.id,
          authorId: reply.discussion.snapshots[0].authorId,
        }}
      />
    </>
  ));
}
