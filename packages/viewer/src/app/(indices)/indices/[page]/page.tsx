import prisma from "@/lib/prisma";
import { selectDiscussion } from "@/lib/discussion";
import { NUM_DISCUSSIONS_TOP_CHARTS } from "../constants";
import TopChart from "../TopChart";

export const metadata = { title: "索引 - 洛谷帖子保存站" };

export default async function Page({ params }: { params: { page: string } }) {
  const page = parseInt(params.page, 10);
  const discussions = await prisma.discussion.findMany({
    select: selectDiscussion,
    where: { takedown: { is: null } },
    orderBy: { id: "desc" },
    skip: (page - 1) * NUM_DISCUSSIONS_TOP_CHARTS,
    take: NUM_DISCUSSIONS_TOP_CHARTS,
  });

  return <TopChart discussions={discussions} />;
}
