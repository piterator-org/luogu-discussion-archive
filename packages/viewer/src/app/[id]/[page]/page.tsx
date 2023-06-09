import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import stringifyTime from "@/lib/time";
import paginate from "@/lib/pagination";
import PageButtons from "@/components/PageButtons";
import Reply from "../Reply";

const REPLIES_PER_PAGE = parseInt(process.env.REPLIES_PER_PAGE ?? "10", 10);

export default async function Page({
  params,
}: {
  params: { id: string; page: string };
}) {
  const id = parseInt(params.id, 10);
  const page = parseInt(params.page, 10);
  const replies =
    (
      await prisma.reply.findMany({
        where: { discussionId: id },
        select: { id: true, author: true, time: true, content: true },
        skip: (page - 1) * REPLIES_PER_PAGE,
        take: REPLIES_PER_PAGE,
      })
    ).map((reply) => ({
      ...reply,
      time: stringifyTime(reply.time),
    })) ?? notFound();
  const numPages = Math.ceil(
    (await prisma.reply.count({ where: { discussionId: id } })) /
      REPLIES_PER_PAGE
  );

  const { pagesLocalAttachedFront, pagesLocalAttachedBack, pagesLocal } =
    paginate(numPages, page);

  return (
    <>
      {replies.map((reply) => (
        <Reply reply={reply} key={reply.id} />
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
