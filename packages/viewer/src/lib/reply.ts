import { Prisma } from "@prisma/client";

export const selectReply = {
  withBasic: Prisma.validator<Prisma.ReplyDefaultArgs>()({
    select: {
      id: true,
      time: true,
      postId: true,
    },
  }).select,
  withLatestSnapshotMeta: Prisma.validator<Prisma.ReplyDefaultArgs>()({
    select: {
      snapshots: {
        select: {
          time: true,
          author: true,
        },
        orderBy: { time: "desc" },
        take: 1,
      },
    },
  }).select,
  withTakedown: Prisma.validator<Prisma.ReplyDefaultArgs>()({
    select: {
      takedown: {
        select: {
          reason: true,
          submitter: {
            select: {
              userSnapshots: true,
            },
          },
        },
      },
    },
  }).select,
  withLatestContent: Prisma.validator<Prisma.ReplyDefaultArgs>()({
    select: {
      snapshots: {
        select: {
          time: true,
          author: true,
          content: true,
        },
        orderBy: { time: "desc" },
        take: 1,
      },
    },
  }).select,
};

export const getReply = {
  latestNoContent: {
    ...selectReply.withBasic,
    ...selectReply.withLatestSnapshotMeta,
  },
  latestWithContent: {
    ...selectReply.withBasic,
    ...selectReply.withLatestContent,
  },
};

export const selectReplyWithLatestSnapshotMeta =
  Prisma.validator<Prisma.ReplyDefaultArgs>()({
    select: getReply.latestNoContent,
  });

export const selectReplyWithLatestContent =
  Prisma.validator<Prisma.ReplyDefaultArgs>()({
    select: getReply.latestWithContent,
  });

export type ReplyWithLatestSnapshotMeta = Prisma.ReplyGetPayload<
  typeof selectReplyWithLatestSnapshotMeta
>;

export type ReplyWithLatestContent = Prisma.ReplyGetPayload<
  typeof selectReplyWithLatestContent
>;
