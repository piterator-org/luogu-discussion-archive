import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { selectDiscussion } from "@/lib/discussion";
import DiscussionEntry from "@/components/DiscussionEntry";

export default async function Page({ params }: { params: { uid: string } }) {
  const uid = parseInt(params.uid, 10);
  if (Number.isNaN(uid)) notFound();
  const discussions = await prisma.discussion.findMany({
    select: selectDiscussion,
    where: { snapshots: { some: { authorId: uid } } },
  });
  return discussions.map((discussion) => (
    <DiscussionEntry discussion={discussion} />
  ));
}
