import "katex/dist/katex.css";
import Image from "next/image";
import katex from "katex";
import splitAtDelimiters from "katex/contrib/auto-render/splitAtDelimiters";
import { User } from "@/types/mongodb";
import UserInfo from "./UserInfo";

export default function Reply({
  reply,
}: {
  reply: {
    time: string;
    author: User;
    content: string;
  };
}) {
  return (
    <div className="reply list-group-item position-relative">
      <a
        href={`https://www.luogu.com.cn/user/${reply.author._id}`}
        className="reply-avatar"
      >
        <Image
          src={`https://cdn.luogu.com.cn/upload/usericon/${reply.author._id}.png`}
          className="rounded-circle shadow"
          fill
          alt={reply.author._id.toString()}
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
          <div
            className="markdown"
            /* eslint-disable-next-line react/no-danger */
            dangerouslySetInnerHTML={{
              __html: splitAtDelimiters(reply.content, [
                { left: "$", right: "$", display: false },
                { left: "$$", right: "$$", display: true },
              ])
                .map((v) =>
                  v.type === "math"
                    ? katex.renderToString(v.data, { displayMode: v.display })
                    : v.data
                )
                .join(""),
            }}
          />
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
