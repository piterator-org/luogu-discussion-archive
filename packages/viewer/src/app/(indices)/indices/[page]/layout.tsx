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
      <h3 className="pb-1 text-center d-none d-md-block mb-4s">最新发布</h3>
      {children}
      <div className="bg-body rounded-4 shadow-bssb my-4s px-4 py-3 py-md-4 text-center">
        <PageButtons
          ellipsisFront={!pagesLocalAttachedFront}
          ellipsisBack={!pagesLocalAttachedBack}
          numPages={numPages}
          pagesLocal={pagesLocal}
          generatorUrl={(curPage: number) => `/indices/${curPage}`}
          active={page}
        />
      </div>
    </>
  );
}
