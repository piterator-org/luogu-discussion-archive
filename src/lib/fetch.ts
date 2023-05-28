import { JSDOM } from "jsdom";
import hash from "object-hash";
import { collection, users } from "@/lib/mongodb";

export interface Reply {
  author: number;
  time: Date;
  content: string;
}

async function fetchPage(id: number, page: number) {
  const response = await fetch(
    `https://www.luogu.com.cn/discuss/${id}?page=${page}`,
    { headers: { cookie: process.env.COOKIE as string }, cache: "no-cache" }
  );
  if (!response.ok) throw Error(response.statusText);
  const { document } = new JSDOM(await response.text()).window;
  const app = document.getElementById("app-old");
  if (!app)
    throw Error(document.querySelector("div")?.textContent ?? undefined);
  return app;
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
function extractUser(element: Element, promises: Promise<unknown>[]) {
  const a = element.querySelector('a[href^="/user/"]')!;
  const uid = parseInt(a.getAttribute("href")!.slice("/user/".length), 10);
  const user = {
    username: a.textContent!,
    color: a.getAttribute("class")!.split(" ", 1)[0].slice("lg-fg-".length),
    checkmark: element.querySelector("a > svg")?.getAttribute("fill") ?? "",
    badge: element.querySelector("span.am-badge")?.innerHTML ?? "",
  };
  promises.push(
    users.then((c) =>
      c.updateOne({ _id: uid }, { $set: user }, { upsert: true })
    )
  );
  return uid;
}

const extractPage = (app: HTMLElement, promises: Promise<unknown>[]) =>
  Array.from(
    app.querySelectorAll("article.am-comment-primary > div.am-comment-main")
  ).map((element) => ({
    author: extractUser(
      element.querySelector("header.am-comment-hd > div.am-comment-meta")!,
      promises
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

const extractMetadata = (app: HTMLElement, promises: Promise<unknown>[]) => ({
  forum: app
    .querySelector(
      'ul.lg-summary-list > li > span > a[href^="/discuss/lists?forumname="]'
    )!
    .getAttribute("href")!
    .slice("/discuss/lists?forumname=".length),
  author: extractUser(
    app.querySelector('ul.lg-summary-list > li > span > a[href^="/user/"]')!
      .parentElement!,
    promises
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
});
/* eslint-enable @typescript-eslint/no-non-null-assertion */

async function fetchReplies(
  id: number,
  pages: number,
  promises: Promise<unknown>[]
) {
  const lastSaved = await (await collection).findOne({ _id: id });
  const lashHashes = new Set(lastSaved?.replies.map(hash.MD5));

  const hashes: Set<string> = new Set();
  const replies: Reply[] = [];
  for (let i = pages; i > 0; i -= 1) {
    const pageHashes: string[] = [];
    // eslint-disable-next-line no-await-in-loop
    const pageReplies = extractPage(await fetchPage(id, i), promises)
      .reverse()
      .filter((reply, index) =>
        ((replyHash) =>
          (!index || replyHash !== pageHashes[pageHashes.length - 1]) &&
          pageHashes.push(replyHash))(hash.MD5(reply))
      );

    let offset;
    for (offset = 0; offset < pageReplies.length; offset += 1)
      if (!hashes.has(pageHashes[offset])) break;
    replies.push(...pageReplies.slice(offset));
    pageHashes.forEach((h) => hashes.add(h));

    if (lastSaved && lastSaved.replies.length) {
      while (
        offset < pageReplies.length &&
        !lashHashes.has(pageHashes[offset]) &&
        pageReplies[offset].time >=
          lastSaved.replies[lastSaved.replies.length - 1].time
      )
        offset += 1;
      if (offset < pageReplies.length)
        return replies.reverse().slice(pageReplies.length - offset);
    }
  }
  return replies.reverse();
}

export default async function saveDiscussion(id: number) {
  const app = await fetchPage(id, 1);
  const promises: Promise<unknown>[] = [];
  const replies = await fetchReplies(
    id,
    Math.max(
      ...Array.from(app.querySelectorAll("[data-ci-pagination-page]")).map(
        (e) => parseInt(e.getAttribute("data-ci-pagination-page") as string, 10)
      ),
      1
    ),
    promises
  );
  await (
    await collection
  ).updateOne(
    { _id: id },
    {
      $set: extractMetadata(app, promises),
      $push: { replies: { $each: replies } },
      $currentDate: { lastUpdate: { $type: "date" } },
    },
    { upsert: true }
  );
}
