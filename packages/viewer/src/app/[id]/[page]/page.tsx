import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import paginate from "@/lib/pagination";
import PageButtons from "@/components/replies/PageButtons";
import serializeReply from "@/lib/serialize-reply";
import Reply from "@/components/replies/Reply";

const REPLIES_PER_PAGE = parseInt(process.env.REPLIES_PER_PAGE ?? "10", 10);

export default async function Page({
  params,
}: {
  params: { id: string; page: string };
}) {
  const id = parseInt(params.id, 10);
  const page = parseInt(params.page, 10);
  if (Number.isNaN(page)) notFound();
  const {
    snapshots: [{ authorId }],
    replies,
    _count: { replies: numReplies },
  } = await prisma.discussion
    .findUnique({
      where: { id },
      select: {
        snapshots: {
          select: { authorId: true },
          orderBy: { time: "desc" },
          take: 1,
        },
        replies: {
          select: {
            id: true,
            author: true,
            time: true,
            content: true,
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
          orderBy: { id: "asc" },
          skip: (page - 1) * REPLIES_PER_PAGE,
          take: REPLIES_PER_PAGE,
        },
        _count: { select: { replies: true } },
      },
    })
    .then((discussion) => discussion ?? notFound())
    .then(async (discussion) => ({
      ...discussion,
      replies: await Promise.all(
        discussion.replies.map(async (reply) => ({
          ...reply,
          ...(await serializeReply(id, reply)),
        })),
      ),
    }));
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
