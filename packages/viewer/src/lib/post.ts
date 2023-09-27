import { Prisma } from "@prisma/client";

export const selectPost = {
  withBasic: Prisma.validator<Prisma.PostDefaultArgs>()({
    select: {
      id: true,
      time: true,
      replyCount: true,
    },
  }).select,
  withLatestSnapshotMeta: Prisma.validator<Prisma.PostDefaultArgs>()({
    select: {
      snapshots: {
        select: {
          time: true,
          title: true,
          forum: true,
          author: true,
        },
        orderBy: { time: "desc" },
        take: 1,
      },
    },
  }).select,
  withTakedown: Prisma.validator<Prisma.PostDefaultArgs>()({
    select: {
      takedown: {
        select: {
          reason: true,
          submitter: true,
        },
      },
    },
  }).select,
  withLatestContent: Prisma.validator<Prisma.PostDefaultArgs>()({
    select: {
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
  }).select,
};

export const getPost = {
  latestNoContent: {
    ...selectPost.withBasic,
    ...selectPost.withLatestSnapshotMeta,
  },
  latestWithContent: {
    ...selectPost.withBasic,
    ...selectPost.withLatestContent,
  },
};

export const selectPostWithLatestSnapshotMeta =
  Prisma.validator<Prisma.PostDefaultArgs>()({
    select: getPost.latestNoContent,
  });

export const selectPostWithLatestContent =
  Prisma.validator<Prisma.PostDefaultArgs>()({
    select: getPost.latestWithContent,
  });

export type PostWithLatestSnapshotMeta = Prisma.PostGetPayload<
  typeof selectPostWithLatestSnapshotMeta
>;

export type PostWithLatestContent = Prisma.PostGetPayload<
  typeof selectPostWithLatestContent
>;
