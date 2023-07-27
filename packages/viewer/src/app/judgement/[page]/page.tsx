import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import paginate from "@/lib/pagination";
import PageButtons from "@/components/replies/PageButtons";
import Ostracon from "@/components/Ostracon";

const OSTRACA_PER_PAGE = parseInt(process.env.OSTRACA_PER_PAGE ?? "10", 10);

export default async function Page({ params }: { params: { page: string } }) {
  const page = parseInt(params.page, 10);
  const ostraca =
    (await prisma.judgement.findMany({
      select: { time: true, user: true, content: true },
      orderBy: { time: "desc" },
      skip: (page - 1) * OSTRACA_PER_PAGE,
      take: OSTRACA_PER_PAGE,
    })) ?? notFound();

  const numPages = Math.ceil(
    (await prisma.judgement.count()) / OSTRACA_PER_PAGE,
  );

  const { pagesLocalAttachedFront, pagesLocalAttachedBack, pagesLocal } =
    paginate(numPages, page);

  return (
    <>
      {ostraca.map((ostracon) => (
        <Ostracon
          ostracon={ostracon}
          key={`${ostracon.time.toISOString()}${ostracon.user.id}`}
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
