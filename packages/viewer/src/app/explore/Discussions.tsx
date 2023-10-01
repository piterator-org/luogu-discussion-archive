import prisma from "@/lib/prisma";
import stringifyTime from "@/lib/time";
import { getPost } from "@/lib/post";
import DiscussionEntry from "@/components/DiscussionEntry";
import { BsCalendar4Week, BsChatDots } from "react-icons/bs";

const NUM_DISCUSSIONS_HOME_PAGE = parseInt(
  process.env.NUM_DISCUSSIONS_HOME_PAGE ?? "50",
  10
);
const LIMIT_MILLISECONDS_HOT_DISCUSSION = parseInt(
  process.env.NUM_DISCUSSIONS_HOME_PAGE ?? "604800000",
  10
);

export default async function Discussions() {
  const discussionReplyCount = await prisma.reply.groupBy({
    by: ["postId"],
    where: {
      time: {
        gte: new Date(new Date().getTime() - LIMIT_MILLISECONDS_HOT_DISCUSSION),
      },
      post: { takedown: { is: null } },
    },
    _count: true,
    orderBy: { _count: { id: "desc" } },
    take: NUM_DISCUSSIONS_HOME_PAGE,
  });
  const discussions = Object.fromEntries(
    (
      await prisma.post.findMany({
        select: getPost.latestNoContent,
        where: { id: { in: discussionReplyCount.map((r) => r.postId) } },
      })
    ).map((d) => [d.id, d])
  );
  discussionReplyCount.map((r) => ({
    ...discussions[r.postId],
    recentReplyCount: r._count,
  }));

  return discussionReplyCount
    .map((r) => ({
      ...discussions[r.postId],
      recentReplyCount: r._count,
    }))
    .map((discussion) => (
      <div className="col-12 col-lg-6" key={discussion.id}>
        <DiscussionEntry
          discussion={discussion}
          decoratorShadow="sm"
          ellipsis
          metaBottom={
            <>
              <BsChatDots
                style={{ position: "relative", top: "-.1125em" }}
                width="1em"
                height="1em"
              />{" "}
              {discussion.replyCount}
              <BsCalendar4Week
                style={{ position: "relative", top: "-.1125em" }}
                className="ms-2"
                width="1em"
                height="1em"
              />{" "}
              {discussion.recentReplyCount}
              <span className="float-end">
                {stringifyTime(discussion.time)}
              </span>
            </>
          }
        />
      </div>
    ));
}
