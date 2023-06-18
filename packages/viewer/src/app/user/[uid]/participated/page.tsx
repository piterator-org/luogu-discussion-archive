import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { selectDiscussion } from "@/lib/discussion";
import serializeReply from "@/lib/serialize-reply";

export default async function Page({ params }: { params: { uid: string } }) {
  const uid = parseInt(params.uid, 10);
  if (Number.isNaN(uid)) notFound();
  const discussions = await prisma.discussion
    .findMany({
      select: {
        ...selectDiscussion,
        replies: { where: { authorId: uid }, orderBy: { id: "asc" } },
      },
      where: {
        OR: [
          { replies: { some: { authorId: uid } } },
          { snapshots: { some: { authorId: uid } } },
        ],
      },
      orderBy: { id: "desc" },
    })
    .then((d) =>
      Promise.all(
        d.map(async (discussion) => ({
          ...discussion,
          replies: await Promise.all(
            discussion.replies.map(async (reply) => ({
              ...reply,
              ...(await serializeReply(discussion.id, reply)),
            }))
          ),
        }))
      )
    );
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <pre>{JSON.stringify(discussions)}</pre>;
}
