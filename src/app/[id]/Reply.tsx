import "highlight.js/styles/tokyo-night-dark.css";
import Image from "next/image";
import { JSDOM } from "jsdom";
import hljs from "highlight.js";
import type { User } from "@prisma/client";
import { getUserUrl, getUserAvatarUrl } from "@/lib/luogu";
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
  };
}) {
  const { body } = new JSDOM(reply.content).window.document;
  body.querySelectorAll("a[href]").forEach((element) => {
    element.setAttribute(
      "href",
      new URL(
        element.getAttribute("href") as string,
        "https://www.luogu.com.cn/discuss/"
      ).href
    );
    element.setAttribute("target", "_blank");
    element.setAttribute("rel", "noopener noreferrer");
  });
  body
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
          <Content content={body.innerHTML} />
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
