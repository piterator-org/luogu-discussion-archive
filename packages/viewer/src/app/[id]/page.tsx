import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import paginate from "@/lib/pagination";
import InfiniteScrollReplies from "@/components/replies/InfiniteScrollReplies";
import { checkExists } from "@/lib/utils";
import savedInLegacyList from "./saved-in-legacy.json";

const REPLIES_PER_PAGE = parseInt(process.env.REPLIES_PER_PAGE ?? "10", 10);

export default async function Page({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const savedAtLegacy = checkExists(savedInLegacyList, id);

  const {
    snapshots: [{ authorId }],
    _count: { replies },
  } =
    (await prisma.post.findUnique({
      where: { id },
      select: {
        snapshots: {
          select: { authorId: true },
          orderBy: { time: "desc" },
          take: 1,
        },
        _count: { select: { replies: true } },
      },
    })) ??
    (savedAtLegacy ? redirect(`https://legacy.lglg.top/${id}`) : notFound());
  const numPages = Math.ceil(replies / REPLIES_PER_PAGE);
  const { pagesLocalAttachedFront, pagesLocalAttachedBack, pagesLocal } =
    paginate(numPages, 1);
  return (
    <InfiniteScrollReplies
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
