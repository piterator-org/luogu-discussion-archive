import { EventEmitter } from "node:events";
import { type BaseLogger } from "pino";
import type { BroadcastOperator } from "socket.io";
import type { PostSnapshot, PrismaClient } from "@prisma/client";
import { getResponse } from "./parser";
import type { ServerToClientEvents } from "../plugins/socket.io";
import { UserSummary, upsertUserSnapshot } from "./user";
import lgUrl from "../utils/url";

const PAGES_PER_SAVE = parseInt(process.env.PAGES_PER_SAVE ?? "64", 10);
export const emitters: Record<number, EventEmitter> = {};

export interface ForumData {
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

export interface ReplyContent {
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
  data: {
    forum: ForumData;
    post: PostData;
    replies: ReplyData;
  };
}

const isPostSame = (
  lastSnapshot: PostSnapshot,
  { forum, post }: { forum: ForumData; post: PostData },
) =>
  lastSnapshot.forumSlug === forum.slug &&
  lastSnapshot.title === post.title &&
  lastSnapshot.authorId === post.author.uid &&
  lastSnapshot.content === post.content;

export async function savePost(
  logger: BaseLogger,
  prisma: PrismaClient,
  id: number,
  maxPages = PAGES_PER_SAVE,
) {
  let allReplies: ReplyContent[] = [];

  const fetchPage = (page: number) =>
    getResponse(logger, lgUrl(`/discuss/${id}?page=${page}`)).then(
      (response): Promise<ResponseBody> => response.json(),
    );

  const saveReplies = async (replies: ReplyContent[]) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const { author } of replies) {
      // eslint-disable-next-line no-await-in-loop
      await upsertUserSnapshot(prisma, author);
    }
    allReplies = [...allReplies, ...replies];
  };

  const saveAllReplies = async () => {
    await prisma.$transaction(async (tx) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const reply of allReplies) {
        // eslint-disable-next-line no-await-in-loop
        await tx.reply.upsert({
          where: { id: reply.id },
          create: {
            id: reply.id,
            postId: id,
            time: new Date(reply.time * 1000),
          },
          update: {},
        });
        // eslint-disable-next-line no-await-in-loop
        const snapshot = await tx.replySnapshot.findFirst({
          where: { replyId: reply.id },
        });
        const isSame =
          snapshot &&
          snapshot.content === reply.content &&
          snapshot.authorId === reply.author.uid;
        if (!isSame) {
          // eslint-disable-next-line no-await-in-loop
          await tx.replySnapshot.create({
            data: {
              authorId: reply.author.uid,
              replyId: reply.id,
              content: reply.content,
              until: new Date(),
            },
          });
        } else {
          // eslint-disable-next-line no-await-in-loop
          await tx.replySnapshot.update({
            where: {
              replyId_time: {
                replyId: snapshot.replyId,
                time: snapshot.time,
              },
            },
            data: { until: new Date() },
          });
        }
      }
    });
  };

  const { post, replies, forum } = (await fetchPage(1)).data;
  const postTime = new Date(post.time * 1000);

  await upsertUserSnapshot(prisma, post.author);

  await prisma.$transaction(
    async (tx) => {
      await tx.post.upsert({
        where: { id },
        create: { id, time: postTime, replyCount: replies.count },
        update: { time: postTime, replyCount: replies.count },
      });

      const lastSnapshot = await tx.postSnapshot.findFirst({
        where: { postId: id },
        orderBy: { time: "desc" },
      });

      if (lastSnapshot && isPostSame(lastSnapshot, { forum, post }))
        await tx.postSnapshot.update({
          where: { postId_time: { time: lastSnapshot.time, postId: id } },
          data: { until: new Date() },
        });
      else
        await tx.postSnapshot.create({
          data: {
            title: post.title,
            forum: {
              connectOrCreate: {
                where: { slug: forum.slug },
                create: { slug: forum.slug, name: forum.name },
              },
            },
            author: { connect: { id: post.author.uid } },
            post: { connect: { id } },
            content: post.content,
          },
        });
    },
    { timeout: 7500 },
  );

  await saveReplies(replies.result);
  await saveAllReplies();
  allReplies = [];

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
      const { replies: newReplies } = (await fetchPage(i)).data;
      // eslint-disable-next-line no-await-in-loop
      await saveReplies(newReplies.result);
      if (newReplies.result[newReplies.result.length - 1].id <= lastReply)
        break;
    }
  }

  await saveAllReplies();

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
