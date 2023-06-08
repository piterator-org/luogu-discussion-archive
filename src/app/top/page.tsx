import prisma from "@/lib/prisma";
import TopCharts from "./TopCharts";

const NUM_DISCUSSIONS_TOP_CHARTS = parseInt(
  process.env.NUM_DISCUSSIONS_TOP_CHARTS ?? "50",
  10
);

export default async function Page() {
  const mostReplies = await prisma.discussion.findMany({
    select: {
      id: true,
      title: true,
      author: true,
      replyCount: true,
      time: true,
    },
    orderBy: { replyCount: "desc" },
    take: NUM_DISCUSSIONS_TOP_CHARTS,
  });

  const mostRecent = await prisma.discussion.findMany({
    select: {
      id: true,
      title: true,
      author: true,
      replyCount: true,
      time: true,
    },
    orderBy: { time: "desc" },
    take: NUM_DISCUSSIONS_TOP_CHARTS,
  });

  return <TopCharts mostReplies={mostReplies} mostRecent={mostRecent} />;
}
