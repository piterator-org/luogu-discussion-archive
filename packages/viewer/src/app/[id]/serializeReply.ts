import { JSDOM } from "jsdom";
import hljs from "highlight.js";
import prisma from "@/lib/prisma";
import { getUserIdFromUrl } from "@/lib/luogu";
import { getUsersMentioned, isMention } from "@/lib/mention";
import stringifyTime from "@/lib/time";

hljs.registerAliases(["plain"], { languageName: "plaintext" });
hljs.configure({ languages: ["cpp"] });

function renderHljs(body: HTMLElement) {
  body
    .querySelectorAll("code")
    .forEach((element) => hljs.highlightElement(element));
}

export default async function serializeReply({
  content,
  time,
}: {
  content: string;
  time: Date;
}) {
  const usersMetioned = await prisma.user.findMany({
    where: { id: { in: getUsersMentioned(content) } },
    include: {
      _count: {
        select: {
          replies: true,
        },
      },
    },
  });
  const mentioned = Object.fromEntries(
    (
      await prisma.user.findMany({
        where: { id: { in: getUsersMentioned(content) } },
      })
    ).map((user) => [user.id, user])
  );

  const { document } = new JSDOM(content).window;
  document.body.querySelectorAll("a[href]").forEach((element) => {
    const urlAbsolute = new URL(
      element.getAttribute("href") as string,
      "https://www.luogu.com.cn/discuss/"
    );
    element.setAttribute("href", urlAbsolute.href);
    element.setAttribute("target", "_blank");
    element.setAttribute("rel", "noopener noreferrer");
    if (isMention(element)) {
      const uid = getUserIdFromUrl(urlAbsolute);
      if (mentioned[getUserIdFromUrl(urlAbsolute)])
        element.setAttribute("data-uid", uid.toString());
      element.classList.add(
        "text-decoration-none",
        "link-teal",
        "cursor-pointer"
      );
    }
  });
  renderHljs(document.body);
  return {
    content: document.body.innerHTML,
    time: stringifyTime(time),
    usersMetioned,
  };
}
