import prisma from "@/lib/prisma";
import PageButtons from "@/components/replies/PageButtons";
import paginate from "@/lib/pagination";
import { NUM_DISCUSSIONS_INDEX } from "../../constants";

export default async function Layout({
  children,
  params,
}: React.PropsWithChildren<{ params: { page: string } }>) {
  const page = parseInt(params.page, 10);
  const numPages = Math.ceil(
    (await prisma.post.count({ where: { takedown: { is: null } } })) /
      NUM_DISCUSSIONS_INDEX,
  );
  const { pagesLocalAttachedFront, pagesLocalAttachedBack, pagesLocal } =
    paginate(numPages, page);
  return (
    <>
      <h3 className="pb-1 text-center mb-4s">最新发布</h3>
      {children}
      <div className="bg-body rounded-4 shadow-bssb my-4s px-4 py-3 py-md-4 text-center">
        <PageButtons
          ellipsisFront={!pagesLocalAttachedFront}
          ellipsisBack={!pagesLocalAttachedBack}
          numPages={numPages}
          pagesLocal={pagesLocal}
          generatorUrl={(curPage: number) => `/index/${curPage}`}
          active={page}
        />
      </div>
    </>
  );
}
