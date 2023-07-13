import { JSDOM } from "jsdom";
import hljs from "highlight.js";
import type { User } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getUserIdFromUrl, getUserUrl } from "@/lib/luogu";
import stringifyTime from "@/lib/time";

export type UserMetioned = User & { numReplies?: number };

function getMentionedUser(element: Element) {
  const href = element.getAttribute("href") as string;
  return (
    element.previousSibling?.nodeType === element.TEXT_NODE &&
    element.previousSibling.nodeValue?.endsWith("@") &&
    getUserIdFromUrl(new URL(href))
  );
}

hljs.registerAliases(["plain"], { languageName: "plaintext" });
hljs.configure({ languages: ["cpp"] });

function renderHljs(body: HTMLElement) {
  body
    .querySelectorAll("pre > code")
    .forEach((element) => hljs.highlightElement(element as HTMLElement));
}

export default async function serializeReply(
  discussionId: number,
  { content, time }: { content: string; time: Date },
) {
  const users: number[] = [];

  const { document } = new JSDOM(content).window;
  document.body.querySelectorAll("a[href]").forEach((element) => {
    element.setAttribute("target", "_blank");
    element.setAttribute("rel", "noopener noreferrer");
    try {
      const urlAbsolute = new URL(
        element.getAttribute("href") as string,
        "https://www.luogu.com.cn/discuss/",
      );
      element.setAttribute("href", urlAbsolute.href);
      const uid = getMentionedUser(element);
      if (uid) {
        users.push(uid);
        element.setAttribute("data-uid", uid.toString());
        element.classList.add("text-decoration-none", "link-teal");
        element.setAttribute("href", getUserUrl(uid));
      }
    } catch (e) {
      // Invalid URL
    }
  });
  const [replyCount, usersMetioned] = await Promise.all([
    prisma.reply
      .groupBy({
        by: ["authorId"],
        where: { discussionId, authorId: { in: users } },
        _count: true,
      })
      .then((r) => Object.fromEntries(r.map((u) => [u.authorId, u._count]))),
    prisma.user.findMany({ where: { id: { in: users } } }),
  ]);
  renderHljs(document.body);
  return {
    content: document.body.innerHTML,
    time: stringifyTime(time),
    usersMetioned: usersMetioned.map((u) => ({
      ...u,
      numReplies: replyCount[u.id],
    })) as UserMetioned[],
  };
}

export async function serializeReplyNoninteractive({
  content,
  time,
}: {
  content: string;
  time: Date;
}) {
  const users: number[] = [];
  const userElements: { ele: Element; user: number }[] = [];
  const links: Set<string> = new Set();
  const linkElements: { ele: Element; link: string }[] = [];

  const { document } = new JSDOM(content).window;
  document.body.querySelectorAll("a[href]").forEach((element) => {
    element.setAttribute("target", "_blank");
    element.setAttribute("rel", "noopener noreferrer");
    let flagLinkUnhandled = true;
    try {
      const urlAbsolute = new URL(
        element.getAttribute("href") as string,
        "https://www.luogu.com.cn/discuss/",
      );
      element.setAttribute("href", urlAbsolute.href);
      const uid = getMentionedUser(element);
      if (uid) {
        flagLinkUnhandled = false;
        users.push(uid);
        userElements.push({ ele: element, user: uid });
        element.setAttribute("data-uid", uid.toString());
        element.classList.add("link-at-user");
        element.setAttribute("href", getUserUrl(uid));
      } else {
        flagLinkUnhandled = false;
        if (
          new URL(
            element.textContent as string,
            "https://www.luogu.com.cn/discuss/",
          ).href !== urlAbsolute.href
        ) {
          links.add(urlAbsolute.href);
          linkElements.push({
            ele: element,
            link: urlAbsolute.href,
          });
        }
      }
    } catch (e) {
      // Invalid URL
    }
    if (flagLinkUnhandled) {
      if (element.textContent !== element.getAttribute("href")) {
        links.add(element.getAttribute("href") ?? "");
        linkElements.push({
          ele: element,
          link: element.getAttribute("href") ?? "",
        });
      }
      element.classList.add("link-failed");
    }
  });
  const usersMetioned = await prisma.user.findMany({
    where: { id: { in: users } },
  });
  const indUsersMetioned: { [k: number]: User } = {};
  // eslint-disable-next-line no-return-assign
  usersMetioned.forEach((el) => (indUsersMetioned[el.id] = el));
  // eslint-disable-next-line no-restricted-syntax
  for (const ue of userElements) {
    if (ue.user in indUsersMetioned) {
      ue.ele.classList.add(`lg-fg-${indUsersMetioned[ue.user].color}`);
    }
  }
  const indLinks: { [k: string]: number } = {};
  // eslint-disable-next-line no-return-assign
  [...links].map((link, i) => (indLinks[link] = i + 1));
  // eslint-disable-next-line no-restricted-syntax
  for (const le of linkElements) {
    le.ele.setAttribute("data-linkid", String(indLinks[le.link]));
  }
  renderHljs(document.body);
  return {
    content: document.body.innerHTML,
    time: stringifyTime(time),
  };
}
