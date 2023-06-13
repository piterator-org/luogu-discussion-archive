import type { Prisma } from "@prisma/client";

export type Discussion = Prisma.DiscussionGetPayload<{
  select: typeof selectDiscussion;
}>;

export const selectDiscussion = {
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
    orderBy: { time: "desc" as Prisma.SortOrder },
    take: 1,
  },
};
