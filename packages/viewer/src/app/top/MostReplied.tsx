import prisma from "@/lib/prisma";
import { selectDiscussion } from "@/lib/discussion";
import { NUM_DISCUSSIONS_TOP_CHARTS } from "./constants";
import TopChart from "./TopChart";

export default async function MostReplied() {
  return (
    <TopChart
      discussions={await prisma.discussion.findMany({
        select: selectDiscussion,
        orderBy: { replyCount: "desc" },
        take: NUM_DISCUSSIONS_TOP_CHARTS,
      })}
    />
  );
}
