import prisma from "@/lib/prisma";
import { selectDiscussion } from "@/lib/discussion";
import paginate from "@/lib/pagination";
import PageButtons from "@/components/replies/PageButtons";
import { NUM_DISCUSSIONS_TOP_CHARTS } from "../constants";
import TopChart from "../TopChart";

export const metadata = { title: "索引 - 洛谷帖子保存站" };

export default async function Page({ params }: { params: { page: string } }) {
  const page = parseInt(params.page, 10);
  const numPages = Math.ceil(
    (await prisma.discussion.count()) / NUM_DISCUSSIONS_TOP_CHARTS,
  );
  const discussions = await prisma.discussion.findMany({
    select: selectDiscussion,
    where: { takedown: { is: null } },
    orderBy: { id: "desc" },
    skip: (page - 1) * NUM_DISCUSSIONS_TOP_CHARTS,
    take: NUM_DISCUSSIONS_TOP_CHARTS,
  });
  const { pagesLocalAttachedFront, pagesLocalAttachedBack, pagesLocal } =
    paginate(numPages, page);

  return (
    <>
      <TopChart discussions={discussions} />
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
