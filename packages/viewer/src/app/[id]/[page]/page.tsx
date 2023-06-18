import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import paginate from "@/lib/pagination";
import PageButtons from "@/components/PageButtons";
import serializeReply from "@/lib/serialize-reply";
import Reply from "@/components/reply/Reply";

const REPLIES_PER_PAGE = parseInt(process.env.REPLIES_PER_PAGE ?? "10", 10);

export default async function Page({
  params,
}: {
  params: { id: string; page: string };
}) {
  const id = parseInt(params.id, 10);
  const page = parseInt(params.page, 10);
  if (Number.isNaN(page)) notFound();
  const [
    {
      snapshots: [{ authorId }],
      _count: { replies: numReplies },
    },
    replies,
  ] = await Promise.all([
    prisma.discussion
      .findUnique({
        where: { id },
        select: {
          snapshots: {
            select: { authorId: true },
            orderBy: { time: "desc" },
            take: 1,
          },
          _count: { select: { replies: true } },
        },
      })
      .then((d) => d ?? notFound()),
    prisma.reply
      .findMany({
        where: { discussionId: id },
        select: { id: true, author: true, time: true, content: true },
        skip: (page - 1) * REPLIES_PER_PAGE,
        take: REPLIES_PER_PAGE,
      })
      .then((r) =>
        r.map(async (reply) => ({
          ...reply,
          ...(await serializeReply(id, reply)),
        }))
      )
      .then((r) => Promise.all(r)),
  ]);
  const numPages = Math.ceil(numReplies / REPLIES_PER_PAGE);
  const { pagesLocalAttachedFront, pagesLocalAttachedBack, pagesLocal } =
    paginate(numPages, page);

  return (
    <>
      {replies.map((reply) => (
        <Reply discussion={{ id, authorId }} reply={reply} key={reply.id} />
      ))}
      {numPages > 1 && (
        <div className="bg-body rounded-4 shadow my-4s px-4 py-3 py-md-4 text-center">
          <PageButtons
            ellipsisFront={!pagesLocalAttachedFront}
            ellipsisBack={!pagesLocalAttachedBack}
            numPages={numPages}
            pagesLocal={pagesLocal}
            generatorUrl={(curPage: number) => `/${id}/${curPage}`}
            active={page}
          />
        </div>
      )}
    </>
  );
}
