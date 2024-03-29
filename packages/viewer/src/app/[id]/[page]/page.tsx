import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import paginate from "@/lib/pagination";
import PageButtons from "@/components/replies/PageButtons";
import Reply from "@/components/replies/Reply";
import { selectReply } from "@/lib/reply";
import { selectPost } from "@/lib/post";
import { checkExists } from "@/lib/utils";
import savedInLegacyList from "../saved-in-legacy.json";

const REPLIES_PER_PAGE = parseInt(process.env.REPLIES_PER_PAGE ?? "10", 10);

export default async function Page({
  params,
}: {
  params: { id: string; page: string };
}) {
  const id = parseInt(params.id, 10);
  const page = parseInt(params.page, 10);
  if (Number.isNaN(page)) notFound();
  const savedAtLegacy = checkExists(savedInLegacyList, id);
  const {
    snapshots,
    replies,
    _count: { replies: numReplies },
  } = (await prisma.post.findUnique({
    where: { id },
    select: {
      ...selectPost.withLatestSnapshotMeta,
      replies: {
        select: {
          ...selectReply.withBasic,
          ...selectReply.withTakedown,
          ...selectReply.withLatestContent,
        },
        orderBy: { id: "asc" },
        skip: (page - 1) * REPLIES_PER_PAGE,
        take: REPLIES_PER_PAGE,
      },
      _count: { select: { replies: true } },
    },
  })) ??
  (savedAtLegacy
    ? redirect(`https://legacy.lglg.top/${id}/${page}`)
    : notFound());
  const numPages = Math.ceil(numReplies / REPLIES_PER_PAGE);
  const { pagesLocalAttachedFront, pagesLocalAttachedBack, pagesLocal } =
    paginate(numPages, page);

  return (
    <>
      {replies.map((reply) => (
        <Reply
          post={{ id, authorId: snapshots[0].author.id }}
          reply={reply}
          key={reply.id}
        />
      ))}
      {numPages > 1 && (
        <div className="bg-body rounded-4 shadow-bssb my-4s px-4 py-3 py-md-4 text-center">
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
