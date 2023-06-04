import { EventEmitter, once } from "node:events";
import { JSDOM } from "jsdom";
import pRetry, { AbortError } from "p-retry";
import prisma from "@/lib/prisma";
import type { PrismaPromise, Reply } from "@prisma/client";

const PAGES_PER_SAVE = parseInt(process.env.PAGES_PER_SAVE ?? "128", 10);
export const emitters: Record<number, EventEmitter> = {};
export const metadata: Set<number> = new Set();

export async function saveDiscussion(id: number, maxPages = PAGES_PER_SAVE) {
  let operations: PrismaPromise<unknown>[] = [];

  async function fetchPage(page: number) {
    const response = await fetch(
      `https://www.luogu.com.cn/discuss/${id}?page=${page}`,
      { headers: { cookie: process.env.COOKIE as string }, cache: "no-cache" }
    );
    if (response.status > 500) throw Error(response.statusText);
    if (!response.ok) throw new AbortError(response.statusText);
    const { document } = new JSDOM(await response.text()).window;
    const app = document.getElementById("app-old");
    if (!app)
      throw new AbortError(
        Error(document.querySelector("div")?.textContent ?? undefined)
      );
    return app;
  }

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  function extractUser(element: Element) {
    const a = element.querySelector('a[href^="/user/"]')!;
    const uid = parseInt(a.getAttribute("href")!.slice("/user/".length), 10);
    const user = {
      username: a.textContent!,
      color: a.getAttribute("class")!.split(" ", 1)[0].slice("lg-fg-".length),
      checkmark: element.querySelector("a > svg")?.getAttribute("fill") ?? null,
      badge: element.querySelector("span.am-badge")?.innerHTML ?? null,
    };
    operations.push(
      prisma.user.upsert({
        where: { id: uid },
        create: { id: uid, ...user },
        update: user,
      })
    );
    return uid;
  }

  const extractReplies = (app: HTMLElement) =>
    Array.from(
      app.querySelectorAll("article.am-comment-primary > div.am-comment-main")
    ).map((element) => ({
      id: parseInt(
        element
          .querySelector(
            "header.am-comment-hd > div.am-comment-meta > a[data-report-id]"
          )!
          .getAttribute("data-report-id")!,
        10
      ),
      discussionId: id,
      authorId: extractUser(
        element.querySelector("header.am-comment-hd > div.am-comment-meta")!
      ),
      time: new Date(
        `${
          Array.from(
            element.querySelector("header.am-comment-hd > div.am-comment-meta")!
              .childNodes
          )
            .filter((node) => node.nodeType === node.TEXT_NODE)
            .map((node) =>
              /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.exec(node.textContent!.trim())
            )
            .filter((node) => node)[0]![0]
        }+8`
      ),
      content: element.querySelector("div.am-comment-bd")!.innerHTML.trim(),
    })) as Reply[];

  const extractMetadata = (app: HTMLElement) => ({
    title: app.querySelector("div.lg-toolbar > h1")!.textContent!,
    forum: app
      .querySelector(
        'ul.lg-summary-list > li > span > a[href^="/discuss/lists?forumname="]'
      )!
      .getAttribute("href")!
      .slice("/discuss/lists?forumname=".length),
    authorId: extractUser(
      app.querySelector('ul.lg-summary-list > li > span > a[href^="/user/"]')!
        .parentElement!
    ),
    time: new Date(
      `${Array.from(app.querySelectorAll("ul.lg-summary-list > li > span")!)
        .filter((element) => !element.children.length)[0]
        .textContent!.trim()}+8`
    ),
    content: app
      .querySelector(
        "article.am-comment-danger > div.am-comment-main > div.am-comment-bd"
      )!
      .innerHTML.trim(),
    replyCount: parseInt(
      app
        .querySelector("article.am-comment-danger")!
        .getAttribute("data-reply-count")!,
      10
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
        })
      );
    });
  }

  const app = await pRetry(() => fetchPage(1), { maxTimeout: 5000 });
  const discussion = extractMetadata(app);
  operations.push(
    prisma.discussion.upsert({
      where: { id },
      create: { id, ...discussion },
      update: discussion,
    })
  );
  saveReplies(extractReplies(app));
  await prisma.$transaction(operations);
  if (id in emitters) emitters[id].emit("start");

  operations = [];
  const pages = Math.max(
    ...Array.from(app.querySelectorAll("[data-ci-pagination-page]")).map((e) =>
      parseInt(e.getAttribute("data-ci-pagination-page") as string, 10)
    )
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
        await pRetry(() => fetchPage(i), { retries: 3 })
      );
      saveReplies(replies);
      if (replies[replies.length - 1].id <= lastReply) break;
    }
  }
  await prisma.$transaction(operations);
  operations = [];

  if (pages > maxPages) await saveDiscussion(id, maxPages + PAGES_PER_SAVE);
}

export function startTask(id: number) {
  if (!(id in emitters)) {
    emitters[id] = new EventEmitter();
    metadata.add(id);
    once(emitters[id], "start").finally(() => metadata.delete(id));
    saveDiscussion(id)
      .catch((err) => emitters[id].emit("error", err))
      .finally(() => {
        delete emitters[id];
      });
  }
  if (metadata.has(id)) return once(emitters[id], "start");
  return [];
}
