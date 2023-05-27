import { JSDOM } from "jsdom";
import hash from "object-hash";

interface Reply {
  author: number;
  time: Date;
  content: string;
}

async function fetchPage(id: string, page: number) {
  const response = await fetch(
    `https://www.luogu.com.cn/discuss/${id}?page=${page}`,
    { headers: { cookie: process.env.COOKIE as string } }
  );
  if (!response.ok) throw Error(response.statusText);
  const { document } = new JSDOM(await response.text()).window;
  const app = document.getElementById("app-old");
  if (!app)
    throw Error(document.querySelector("div")?.textContent ?? undefined);
  return app;
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const extractPage = (app: HTMLElement) =>
  Array.from(
    app.querySelectorAll("article.am-comment-primary > div.am-comment-main")
  ).map((element) => ({
    author: parseInt(
      element
        .querySelector(
          'header.am-comment-hd > div.am-comment-meta > a[href^="/user/"]'
        )!
        .getAttribute("href")!
        .slice("/user/".length),
      10
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
    content: element.querySelector("div.am-comment-bd")?.innerHTML.trim(),
  })) as Reply[];

function extractMetadata(app: HTMLElement) {
  return {
    forum: app
      .querySelector(
        'ul.lg-summary-list > li > span > a[href^="/discuss/lists?forumname="]'
      )!
      .getAttribute("href")!
      .slice("/discuss/lists?forumname=".length),
    author: app
      .querySelector('ul.lg-summary-list > li > span > a[href^="/user/"]')!
      .getAttribute("href")!
      .slice("/user/".length),
    time: new Date(
      `${Array.from(app.querySelectorAll("ul.lg-summary-list > li > span")!)
        .filter((element) => !element.children.length)[0]
        .textContent!.trim()}+8`
    ),
    content: app.querySelector(
      "article.am-comment-danger > div.am-comment-main > div.am-comment-bd"
    )!.innerHTML,
  };
}
/* eslint-enable @typescript-eslint/no-non-null-assertion */

export default async function fetchDiscussion(id: string) {
  const app = await fetchPage(id, 1);
  const lastPage = Math.max(
    ...Array.from(app.querySelectorAll("[data-ci-pagination-page]")).map(
      (element) =>
        parseInt(element.getAttribute("data-ci-pagination-page") as string, 10)
    )
  );

  if (lastPage < 1)
    return { ...extractMetadata(app), replies: extractPage(app) };

  const hashes: Set<string> = new Set();
  const replies: Reply[] = [];
  for (let i = lastPage; i > 0; i -= 1) {
    const pageHashes: string[] = [];
    // eslint-disable-next-line no-await-in-loop
    const pageReplies = extractPage(await fetchPage(id, i))
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
  }
  return { ...extractMetadata(app), replies: replies.reverse() };
}
