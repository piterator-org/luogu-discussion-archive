import { JSDOM } from "jsdom";
import hljs from "highlight.js";
import prisma from "@/lib/prisma";
import { getUserIdFromUrl } from "@/lib/luogu";
import stringifyTime from "@/lib/time";

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
    .querySelectorAll("code")
    .forEach((element) => hljs.highlightElement(element));
}

export default async function serializeReply(
  discussionId: number,
  { content, time }: { content: string; time: Date }
) {
  const users: number[] = [];

  const { document } = new JSDOM(content).window;
  document.body.querySelectorAll("a[href]").forEach((element) => {
    element.setAttribute("target", "_blank");
    element.setAttribute("rel", "noopener noreferrer");
    try {
      const urlAbsolute = new URL(
        element.getAttribute("href") as string,
        "https://www.luogu.com.cn/discuss/"
      );
      element.setAttribute("href", urlAbsolute.href);
      const uid = getMentionedUser(element);
      if (uid) {
        users.push(uid);
        element.setAttribute("data-uid", uid.toString());
        element.classList.add("text-decoration-none", "link-teal");
      }
    } catch (e) {
      // Invalid URL
    }
  });
  // TODO: 下次要把这里改成 Promise.all
  const replyCount = Object.fromEntries(
    (
      await prisma.reply.groupBy({
        by: ["authorId"],
        where: { discussionId, authorId: { in: users } },
        _count: true,
      })
    ).map((u) => [u.authorId, u._count])
  );
  const usersMetioned = (
    await prisma.user.findMany({ where: { id: { in: users } } })
  ).map((u) => ({ ...u, numReplies: replyCount[u.id] }));
  renderHljs(document.body);
  return {
    content: document.body.innerHTML,
    time: stringifyTime(time),
    usersMetioned,
  };
}
