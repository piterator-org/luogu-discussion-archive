import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import paginate from "@/lib/pagination";
import PageButtons from "@/components/replies/PageButtons";
import PotteryShard from "../PotteryShard";

const SHARDS_PER_PAGE = parseInt(process.env.SHARDS_PER_PAGE ?? "10", 10);

export default async function Page({ params }: { params: { page: string } }) {
  const page = parseInt(params.page, 10);
  const shards =
    (await prisma.judgement.findMany({
      select: { time: true, user: true, content: true },
      orderBy: { time: "desc" },
      skip: (page - 1) * SHARDS_PER_PAGE,
      take: SHARDS_PER_PAGE,
    })) ?? notFound();

  const numPages = Math.ceil(
    (await prisma.judgement.count()) / SHARDS_PER_PAGE
  );

  const { pagesLocalAttachedFront, pagesLocalAttachedBack, pagesLocal } =
    paginate(numPages, page);

  return (
    <>
      {shards.map((shard) => (
        <PotteryShard
          shard={shard}
          key={`${shard.time.toISOString()}${shard.user.id}`}
        />
      ))}
      {numPages > 1 && (
        <div className="bg-body rounded-4 shadow my-4s px-4 py-3 py-md-4 text-center">
          <PageButtons
            ellipsisFront={!pagesLocalAttachedFront}
            ellipsisBack={!pagesLocalAttachedBack}
            numPages={numPages}
            pagesLocal={pagesLocal}
            generatorUrl={(curPage: number) => `/judgement/${curPage}`}
            active={page}
          />
        </div>
      )}
    </>
  );
}
