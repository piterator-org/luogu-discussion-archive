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
  const usersMetioned = Object.fromEntries(
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
      if (usersMetioned[getUserIdFromUrl(urlAbsolute)] !== undefined) {
        element.classList.add("link-success");
        // eslint-disable-next-line no-param-reassign
        if (
          element.innerHTML !==
          usersMetioned[getUserIdFromUrl(urlAbsolute)].username
        ) {
          const originalUsername = document.createElement("span");
          originalUsername.innerHTML = `(${element.innerHTML})`;
          originalUsername.classList.add("text-warning");
          // eslint-disable-next-line no-param-reassign
          element.innerHTML =
            usersMetioned[getUserIdFromUrl(urlAbsolute)].username;
          element.append(originalUsername);
        }
      } else {
        element.classList.add("link-danger");
      }
      element.classList.add("text-decoration-none");
    }
  });
  renderHljs(document.body);
  return {
    content: document.body.innerHTML,
    time: stringifyTime(time),
    usersMetioned,
  };
}
