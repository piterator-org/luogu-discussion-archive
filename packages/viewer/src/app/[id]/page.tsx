import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import paginate from "@/lib/pagination";
import InfiniteScroll from "./InfiniteScroll";

const REPLIES_PER_PAGE = parseInt(process.env.REPLIES_PER_PAGE ?? "10", 10);

export default async function Page({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const {
    snapshots: [{ authorId }],
  } =
    (await prisma.discussion.findUnique({
      where: { id },
      select: {
        snapshots: {
          select: { authorId: true },
          orderBy: { time: "desc" },
          take: 1,
        },
      },
    })) ?? notFound();
  const numPages = Math.ceil(
    (await prisma.reply.count({ where: { discussionId: id } })) /
      REPLIES_PER_PAGE
  );
  const { pagesLocalAttachedFront, pagesLocalAttachedBack, pagesLocal } =
    paginate(numPages, 1);
  return (
    <InfiniteScroll
      discussion={{ id, authorId }}
      pagination={{
        numPages,
        pagesLocalAttachedFront,
        pagesLocalAttachedBack,
        pagesLocal,
      }}
    />
  );
}
