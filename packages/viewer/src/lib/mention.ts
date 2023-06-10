import { JSDOM } from "jsdom";
import { isUserUrl, getUserIdFromUrl } from "@/lib/luogu";

export default function getUsersMentioned(content: string) {
  const { body } = new JSDOM(content).window.document;
  const users: number[] = [];
  body.querySelectorAll("a[href]").forEach((element) => {
    const urlAbsolute = new URL(
      element.getAttribute("href") as string,
      "https://www.luogu.com.cn/discuss/"
    );
    if (
      element.previousSibling !== null &&
      element.previousSibling.nodeName === "#text" &&
      element.previousSibling.nodeValue !== null &&
      element.previousSibling.nodeValue.endsWith("@") &&
      isUserUrl(urlAbsolute)
    )
      users.push(getUserIdFromUrl(urlAbsolute));
  });
  return users;
}
