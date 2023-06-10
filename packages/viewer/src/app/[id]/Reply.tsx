import "highlight.js/styles/tokyo-night-dark.css";
import Image from "next/image";
import { JSDOM } from "jsdom";
import hljs from "highlight.js";
import type { User } from "@prisma/client";
import {
  getUserUrl,
  getUserAvatarUrl,
  isUserUrl,
  getUserIdFromUrl,
} from "@/lib/luogu";
import UserInfo from "@/components/UserInfo";
import Content from "./Content";

hljs.registerAliases(["plain"], { languageName: "plaintext" });
hljs.configure({ languages: ["cpp"] });

export default function Reply({
  reply,
}: {
  reply: {
    time: string;
    author: User;
    content: string;
    usersMetioned: Record<number, User>;
  };
}) {
  const doc = new JSDOM(reply.content).window.document;
  doc.body.querySelectorAll("a[href]").forEach((element) => {
    const urlAbsolute = new URL(
      element.getAttribute("href") as string,
      "https://www.luogu.com.cn/discuss/"
    );
    element.setAttribute("href", urlAbsolute.href);
    element.setAttribute("target", "_blank");
    element.setAttribute("rel", "noopener noreferrer");
    if (
      element.previousSibling !== null &&
      element.previousSibling.nodeName === "#text" &&
      element.previousSibling.nodeValue !== null &&
      element.previousSibling.nodeValue.endsWith("@") &&
      isUserUrl(urlAbsolute)
    ) {
      if (reply.usersMetioned[getUserIdFromUrl(urlAbsolute)] !== undefined) {
        element.classList.add("link-success");
        // eslint-disable-next-line no-param-reassign
        if (
          element.innerHTML !==
          reply.usersMetioned[getUserIdFromUrl(urlAbsolute)].username
        ) {
          const originalUsername = doc.createElement("span");
          originalUsername.innerHTML = `(${element.innerHTML})`;
          originalUsername.classList.add("text-warning");
          // eslint-disable-next-line no-param-reassign
          element.innerHTML =
            reply.usersMetioned[getUserIdFromUrl(urlAbsolute)].username;
          element.append(originalUsername);
        }
      } else {
        element.classList.add("link-warning");
      }
      element.classList.add("text-decoration-none");
    }
  });
  doc.body
    .querySelectorAll("code")
    .forEach((element) => hljs.highlightElement(element));

  return (
    <div className="reply position-relative">
      <a
        href={getUserUrl(reply.author.id)}
        className="reply-avatar"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src={getUserAvatarUrl(reply.author.id)}
          className="rounded-circle shadow"
          fill
          alt={reply.author.id.toString()}
        />
      </a>
      <div className="reply-card bg-white rounded-4 shadow mb-4s">
        <div className="reply-meta bg-light rounded-top-4 pe-4 py-2">
          {/* <span className="font-monospace align-top text-body-tertiary me-1">@</span> */}
          <UserInfo user={reply.author} />
          <span className="float-end text-body-tertiary d-none d-md-inline">
            {reply.time}
          </span>
        </div>
        <div className="reply-content pe-4 py-2">
          <Content content={doc.body.innerHTML} />
          <span
            className="text-end text-body-tertiary d-block d-md-none"
            style={{ fontSize: ".8rem" }}
          >
            {reply.time}
          </span>
        </div>
      </div>
    </div>
  );
}
