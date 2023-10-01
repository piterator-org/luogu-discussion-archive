import prisma from "@/lib/prisma";
import { getPost } from "@/lib/post";
import { NUM_DISCUSSIONS_INDEX } from "../constants";
import PostIndex from "../DiscussionIndex";

export const metadata = { title: "热门 - 洛谷帖子保存站" };

export const dynamic = "force-dynamic";

export default async function MostReplied() {
  return (
    <>
      <h3 className="pb-1 text-center mb-4s">最多回复</h3>
      <PostIndex
        posts={await prisma.post.findMany({
          where: { takedown: { is: null } },
          orderBy: { replyCount: "desc" },
          take: NUM_DISCUSSIONS_INDEX,
          select: getPost.latestNoContent,
        })}
      />
    </>
  );
}
