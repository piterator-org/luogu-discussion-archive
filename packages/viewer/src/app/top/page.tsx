import prisma from "@/lib/prisma";
import TopCharts from "./TopCharts";

export const dynamic = "force-dynamic";

const NUM_DISCUSSIONS_TOP_CHARTS = parseInt(
  process.env.NUM_DISCUSSIONS_TOP_CHARTS ?? "50",
  10
);

export const metadata = { title: "排行榜 - 洛谷帖子保存站" };

export default async function Page() {
  const mostReplies = await prisma.discussion.findMany({
    select: {
      id: true,
      time: true,
      replyCount: true,
      snapshots: {
        select: {
          time: true,
          title: true,
          forum: true,
          author: true,
          content: true,
        },
        orderBy: { time: "desc" },
        take: 1,
      },
    },
    orderBy: { replyCount: "desc" },
    take: NUM_DISCUSSIONS_TOP_CHARTS,
  });

  const mostRecent = await prisma.discussion.findMany({
    select: {
      id: true,
      time: true,
      replyCount: true,
      snapshots: {
        select: {
          time: true,
          title: true,
          forum: true,
          author: true,
          content: true,
        },
        orderBy: { time: "desc" },
        take: 1,
      },
    },
    orderBy: { id: "desc" },
    take: NUM_DISCUSSIONS_TOP_CHARTS,
  });

  return <TopCharts mostReplies={mostReplies} mostRecent={mostRecent} />;
}
