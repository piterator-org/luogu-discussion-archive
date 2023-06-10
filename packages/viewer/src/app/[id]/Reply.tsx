import "highlight.js/styles/tokyo-night-dark.css";
import type { User } from "@prisma/client";
import UserAvatar from "@/components/UserAvatar";
import UserInfo from "@/components/UserInfo";
import Content from "./Content";

export default function Reply({
  reply,
}: {
  reply: {
    time: string;
    author: User;
    content: string;
    usersMetioned: User[];
  };
}) {
  return (
    <div className="reply position-relative">
      <UserAvatar className="reply-avatar" user={reply.author} />
      <div className="reply-card bg-white rounded-4 shadow mb-4s">
        <div className="reply-meta bg-light rounded-top-4 pe-4 py-2">
          {/* <span className="font-monospace align-top text-body-tertiary me-1">@</span> */}
          <UserInfo user={reply.author} />
          <span className="float-end text-body-tertiary d-none d-md-inline">
            {reply.time}
          </span>
        </div>
        <div className="reply-content pe-4 py-2 position-relative">
          <Content
            content={reply.content}
            usersMetioned={reply.usersMetioned}
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
