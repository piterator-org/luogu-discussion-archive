import { EventEmitter } from "node:events";
import type { BaseLogger } from "pino";
import type { BroadcastOperator } from "socket.io";
import type { PrismaClient, PrismaPromise, Reply } from "@prisma/client";
import { parseApp, parseComment, parseUser } from "./parser";
import type { ServerToClientEvents } from "../plugins/socket.io";

const PAGES_PER_SAVE = parseInt(process.env.PAGES_PER_SAVE ?? "128", 10);
export const emitters: Record<number, EventEmitter> = {};

export async function saveDiscussion(
  logger: BaseLogger,
  prisma: PrismaClient,
  id: number,
  maxPages = PAGES_PER_SAVE,
) {
  let operations: PrismaPromise<unknown>[] = [];

  const fetchPage = (page: number) =>
    parseApp(logger, `https://www.luogu.com.cn/discuss/${id}?page=${page}`, 3);

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  function extractComment(element: Element) {
    const user = parseUser(element.querySelector(".am-comment-meta")!);
    operations.push(
      prisma.user.upsert({
        where: { id: user.id },
        create: user,
        update: user,
      }),
    );
    return { authorId: user.id, ...parseComment(element) };
  }

  const extractReplies = (app: HTMLElement) =>
    Array.from(
      app.querySelectorAll("article.am-comment-primary > div.am-comment-main"),
    ).map((element) => ({
      id: parseInt(
        element
          .querySelector(".am-comment-hd a[data-report-id]")!
          .getAttribute("data-report-id")!,
        10,
      ),
      discussionId: id,
      ...extractComment(element),
    })) as Reply[];

  const extractMetadata = (app: HTMLElement) => ({
    title: app.querySelector("div.lg-toolbar > h1")!.textContent!,
    forum: app
      .querySelector(
        'ul.lg-summary-list > li > span > a[href^="/discuss/lists?forumname="]',
      )!
      .getAttribute("href")!
      .slice("/discuss/lists?forumname=".length),
    ...extractComment(
      app.querySelector("article.am-comment-danger > div.am-comment-main")!,
    ),
    replyCount: parseInt(
      app
        .querySelector("article.am-comment-danger")!
        .getAttribute("data-reply-count")!,
      10,
    ),
  });
  /* eslint-enable @typescript-eslint/no-non-null-assertion */

  function saveReplies(replies: Reply[]) {
    replies.forEach((reply) => {
      operations.push(
        prisma.reply.upsert({
          where: { id: reply.id },
          create: reply,
          update: reply,
        }),
      );
    });
  }

  const app = await fetchPage(1);
  const discussion = extractMetadata(app);
  operations.push(
    prisma.discussion.upsert({
      where: { id },
      create: { id, time: discussion.time, replyCount: discussion.replyCount },
      update: { time: discussion.time, replyCount: discussion.replyCount },
    }),
  );

  const lastSnapshot = await prisma.snapshot.findFirst({
    where: { discussionId: id },
    orderBy: { time: "desc" },
  });
  operations.push(
    lastSnapshot &&
      lastSnapshot.forum === discussion.forum &&
      lastSnapshot.title === discussion.title &&
      lastSnapshot.authorId === discussion.authorId &&
      lastSnapshot.content === discussion.content
      ? prisma.snapshot.update({
          where: {
            discussionId_time: {
              discussionId: lastSnapshot.discussionId,
              time: lastSnapshot.time,
            },
          },
          data: { until: new Date() },
        })
      : prisma.snapshot.create({
          data: {
            discussionId: id,
            title: discussion.title,
            forum: discussion.forum,
            authorId: discussion.authorId,
            content: discussion.content,
          },
        }),
  );

  saveReplies(extractReplies(app));
  await prisma.$transaction(operations);
  if (id in emitters) emitters[id].emit("start");

  operations = [];
  const pages = Math.max(
    ...Array.from(app.querySelectorAll("[data-ci-pagination-page]")).map((e) =>
      parseInt(e.getAttribute("data-ci-pagination-page") as string, 10),
    ),
  );
  if (pages > 1) {
    const { id: lastReply } = (
      await prisma.reply.findMany({
        where: { discussionId: id },
        orderBy: { id: "desc" },
        take: 1,
      })
    )[0];
    for (let i = Math.min(pages, maxPages); i > 0; i -= 1) {
      const replies = extractReplies(
        // eslint-disable-next-line no-await-in-loop
        await fetchPage(i),
      );
      saveReplies(replies);
      if (replies[replies.length - 1].id <= lastReply) break;
    }
  }
  await prisma.$transaction(operations);
  operations = [];

  if (pages > maxPages)
    await saveDiscussion(logger, prisma, id, maxPages + PAGES_PER_SAVE);
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
    saveDiscussion(logger, prisma, id)
      .then(() => emitters[id].emit("done"))
      .catch((err) => {
        emitters[id].emit("error", err);
        logger.error(err);
      })
      .finally(() => delete emitters[id]);
  }
}
