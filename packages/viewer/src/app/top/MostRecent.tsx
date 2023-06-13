import { selectDiscussion } from "@/lib/discussion";
import prisma from "@/lib/prisma";
import { NUM_DISCUSSIONS_TOP_CHARTS } from "./constants";
import TopChart from "./TopChart";

export default async function MostRecent() {
  return (
    <TopChart
      discussions={await prisma.discussion.findMany({
        select: selectDiscussion,
        orderBy: { id: "desc" },
        take: NUM_DISCUSSIONS_TOP_CHARTS,
      })}
    />
  );
}
