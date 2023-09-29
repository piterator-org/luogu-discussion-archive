import { Prisma } from "@prisma/client";
import { getReply } from "./reply";
import { selectUser } from "./user";

export const selectPost = {
  withBasic: Prisma.validator<Prisma.PostDefaultArgs>()({
    select: {
      id: true,
      time: true,
      replyCount: true,
    },
  }).select,

  // Not compatible to use `withLatestContent` here, because the `content` field
  withLatestSnapshotMeta: Prisma.validator<Prisma.PostDefaultArgs>()({
    select: {
      snapshots: {
        select: {
          time: true,
          title: true,
          forum: true,
          author: {
            select: selectUser.withLatest,
          },
          until: true,
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
          submitter: { select: selectUser.withLatest },
        },
      },
    },
  }).select,

  // Not compatible to use `withLatestSnapshotMeta` here, because the `content` field
  withLatestContent: Prisma.validator<Prisma.PostDefaultArgs>()({
    select: {
      snapshots: {
        select: {
          time: true,
          title: true,
          forum: true,
          author: {
            select: selectUser.withLatest,
          },
          content: true,
          until: true,
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

export const selectPostWithLatestReplies =
  Prisma.validator<Prisma.PostDefaultArgs>()({
    select: {
      ...selectPost.withLatestContent,
      replies: {
        select: getReply.latestWithContent,
      },
    },
  });

export type PostWithLatestSnapshotMeta = Prisma.PostGetPayload<
  typeof selectPostWithLatestSnapshotMeta
>;

export type PostWithLatestContent = Prisma.PostGetPayload<
  typeof selectPostWithLatestContent
>;

export type PostWithLatestReplies = Prisma.PostGetPayload<
  typeof selectPostWithLatestReplies
>;
