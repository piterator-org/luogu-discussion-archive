import { EventEmitter } from "node:events";
import type { BaseLogger } from "pino";
import type { BroadcastOperator } from "socket.io";
import type { PrismaClient, PrismaPromise } from "@prisma/client";
import { getResponse } from "./parser";
import type { ServerToClientEvents } from "../plugins/socket.io";
import { UserSummary } from "./user";

const PAGES_PER_SAVE = parseInt(process.env.PAGES_PER_SAVE ?? "128", 10);
export const emitters: Record<number, EventEmitter> = {};

interface ForumData {
  name: string;
  type: number;
  slug: string;
  color: string;
}

interface PostData {
  id: number;
  title: string;
  author: UserSummary;
  time: number;
  content: string;
}

interface ReplyContent {
  id: number;
  author: UserSummary;
  time: number;
  content: string;
}

interface ReplyData {
  count: number;
  perPage: number;
  result: ReplyContent[];
}

interface ResponseBody {
  currentData: {
    forum: ForumData;
    post: PostData;
    replies: ReplyData;
  };
}

export async function savePost(
  logger: BaseLogger,
  prisma: PrismaClient,
  id: number,
  maxPages = PAGES_PER_SAVE,
) {
  const operations: PrismaPromise<unknown>[] = [];

  const fetchPage = (page: number) =>
    getResponse(
      logger,
      `https://www.luogu.com.cn/discuss/${id}?_contentOnly&page=${page}`,
      true,
    ).then((response): Promise<ResponseBody> => response.json());

  const saveReplies = async (replies: ReplyContent[]) => {
    // Create reply if non exists
    let replyOperations: PrismaPromise<unknown>[] = [];
    replies.forEach((reply) => {
      replyOperations.push(
        prisma.reply.upsert({
          where: { id: reply.id },
          create: {
            id: reply.id,
            postId: id,
            time: new Date(reply.time * 1000),
          },
          update: {},
        }),
      );
    });
    await prisma.$transaction(replyOperations);

    // TODO: User Snapshot Hook

    replyOperations = [];
    await Promise.all(
      /* Promise<void>[] */ replies.map(async (reply) => {
        const lastSnapshot = await prisma.replySnapshot.findFirst({
          where: { replyId: reply.id },
          orderBy: { time: "desc" },
        });
        replyOperations.push(
          !lastSnapshot ||
            lastSnapshot.authorId !== reply.author.uid ||
            lastSnapshot.content !== reply.content
            ? prisma.replySnapshot.create({
                data: {
                  replyId: reply.id,
                  content: reply.content,
                  authorId: reply.author.uid,
                  until: new Date(),
                  time: new Date(reply.time * 1000),
                },
              })
            : prisma.replySnapshot.update({
                where: {
                  replyId: lastSnapshot.replyId,
                  replyId_time: {
                    replyId: lastSnapshot.replyId,
                    time: lastSnapshot.time,
                  },
                },
                data: { until: new Date() },
              }),
        );
      }),
    );
    await prisma.$transaction(replyOperations);
  };

  const { post, replies, forum } = await fetchPage(1).then(
    (data) => data.currentData,
  );
  const postTime = new Date(post.time * 1000);
  operations.push(
    prisma.post.upsert({
      where: { id },
      create: { id, time: postTime, replyCount: replies.count },
      update: { time: postTime, replyCount: replies.count },
    }),
  );

  // TODO: user snapshot update hook will be called here

  const lastSnapshot = await prisma.postSnapshot.findFirst({
    where: { postId: id },
    orderBy: { time: "desc" },
  });

  operations.push(
    lastSnapshot &&
      lastSnapshot.forumSlug === forum.slug &&
      lastSnapshot.title === post.title &&
      lastSnapshot.authorId === post.author.uid &&
      lastSnapshot.content === post.content
      ? prisma.postSnapshot.update({
          where: {
            postId_time: {
              postId: lastSnapshot.postId,
              time: lastSnapshot.time,
            },
          },
          data: { until: new Date() },
        })
      : prisma.postSnapshot.create({
          data: {
            postId: id,
            title: post.title,
            forumSlug: forum.slug,
            authorId: post.author.uid,
            content: post.content,
          },
        }),
  );

  await prisma.$transaction(operations);

  let lastPromise = saveReplies(replies.result);
  if (id in emitters) emitters[id].emit("start");
  const pages = Math.ceil(replies.count / replies.perPage);
  if (pages > 1) {
    const { id: lastReply } = (
      await prisma.reply.findMany({
        where: { postId: id },
        orderBy: { id: "desc" },
        take: 1,
      })
    )[0];
    for (let i = Math.min(pages, maxPages); i > 0; i -= 1) {
      // eslint-disable-next-line no-await-in-loop
      const [newReplies] = await Promise.all([
        fetchPage(i).then((data) => data.currentData.replies.result),
        lastPromise,
      ]);
      lastPromise = saveReplies(newReplies);
      if (newReplies[newReplies.length - 1].id <= lastReply) break;
    }
  }

  await lastPromise;

  if (pages > maxPages)
    await savePost(logger, prisma, id, maxPages + PAGES_PER_SAVE);
}

export function startTask(
  logger: BaseLogger,
  prisma: PrismaClient,
  room: BroadcastOperator<ServerToClientEvents, unknown>,
  id: number,
) {
  if (!(id in emitters)) {
    emitters[id] = new EventEmitter();
    emitters[id].on("start", () => room.volatile.emit("start"));
    emitters[id].on("done", () => room.emit("success"));
    emitters[id].on("error", (err: Error) => room.emit("failure", err.message));
    savePost(logger, prisma, id)
      .then(() => emitters[id].emit("done"))
      .catch((err) => {
        emitters[id].emit("error", err);
        logger.error(err);
      })
      .finally(() => delete emitters[id]);
  }
}
