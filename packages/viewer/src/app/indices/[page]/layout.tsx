import prisma from "@/lib/prisma";
import PageButtons from "@/components/replies/PageButtons";
import paginate from "@/lib/pagination";
import { NUM_DISCUSSIONS_TOP_CHARTS } from "../constants";

export default async function Layout({
  children,
  params,
}: React.PropsWithChildren<{ params: { page: string } }>) {
  const page = parseInt(params.page, 10);
  const numPages = Math.ceil(
    (await prisma.discussion.count()) / NUM_DISCUSSIONS_TOP_CHARTS,
  );
  const { pagesLocalAttachedFront, pagesLocalAttachedBack, pagesLocal } =
    paginate(numPages, page);
  return (
    <>
      {children}
      <PageButtons
        ellipsisFront={!pagesLocalAttachedFront}
        ellipsisBack={!pagesLocalAttachedBack}
        numPages={numPages}
        pagesLocal={pagesLocal}
        generatorUrl={(curPage: number) => `/indices/${curPage}`}
        active={page}
      />
    </>
  );
}
