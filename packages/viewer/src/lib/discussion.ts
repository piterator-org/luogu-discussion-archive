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
    },
    orderBy: { time: "desc" as Prisma.SortOrder },
    take: 1,
  },
};

export type DiscussionWithContent = Prisma.DiscussionGetPayload<{
  select: typeof selectDiscussionWithContent;
}>;

export const selectDiscussionWithContent = {
  ...selectDiscussion,
  snapshots: {
    ...selectDiscussion.snapshots,
    select: { ...selectDiscussion.snapshots.select, content: true },
  },
};
