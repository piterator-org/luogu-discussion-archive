import { JSDOM } from "jsdom";
import { isUserUrl, getUserIdFromUrl } from "@/lib/luogu";

export function isMention(element: Element) {
  const href = element.getAttribute("href");
  return Boolean(
    href &&
      isUserUrl(new URL(href, "https://www.luogu.com.cn/discuss/")) &&
      element.previousSibling?.nodeType === element.TEXT_NODE &&
      element.previousSibling.nodeValue?.endsWith("@")
  );
}

export function getUsersMentioned(content: string) {
  const { body } = new JSDOM(content).window.document;
  const users: number[] = [];
  body.querySelectorAll("a[href]").forEach((element) => {
    const urlAbsolute = new URL(
      element.getAttribute("href") as string,
      "https://www.luogu.com.cn/discuss/"
    );
    if (isMention(element)) users.push(getUserIdFromUrl(urlAbsolute));
  });
  return users;
}
