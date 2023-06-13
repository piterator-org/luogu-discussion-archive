import prisma from "@/lib/prisma";
import { selectDiscussion } from "@/lib/discussion";
import TopCharts from "./TopCharts";
import TopChart from "./TopChart";

export const dynamic = "force-dynamic";

const NUM_DISCUSSIONS_TOP_CHARTS = parseInt(
  process.env.NUM_DISCUSSIONS_TOP_CHARTS ?? "50",
  10
);

export const metadata = { title: "排行榜 - 洛谷帖子保存站" };

export default async function Page() {
  const [mostReplies, mostRecent] = await Promise.all([
    prisma.discussion.findMany({
      select: selectDiscussion,
      orderBy: { replyCount: "desc" },
      take: NUM_DISCUSSIONS_TOP_CHARTS,
    }),
    prisma.discussion.findMany({
      select: selectDiscussion,
      orderBy: { id: "desc" },
      take: NUM_DISCUSSIONS_TOP_CHARTS,
    }),
  ]);

  return (
    <TopCharts>
      <>
        <h4 className="pb-1 text-center d-none d-md-block mb-4s">最高楼层</h4>
        <TopChart discussions={mostReplies} />
      </>
      <>
        <h4 className="pb-1 text-center d-none d-md-block mb-4s">最新发布</h4>
        <TopChart discussions={mostRecent} />
      </>
      <>
        <h4 className="pb-1 text-center d-none d-md-block mb-4s">最多点击</h4>
        <div className="rounded-4 shadow px-4 py-3">
          <p className="my-5x text-center text-body-secondary">即将上线</p>
        </div>
      </>
    </TopCharts>
  );
}
