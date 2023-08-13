"use client";

import { useState } from "react";
import type { User } from "@prisma/client";
import Link from "next/link";
import type { UserMetioned } from "@/lib/serialize-reply";
import UserAvatar from "@/components/UserAvatar";
import UserInfo from "@/components/UserInfo";
import Content from "./Content";
import ContextViewer from "./ContextViewer";

export default function Reply({
  discussion,
  reply,
  children,
}: React.PropsWithChildren<{
  discussion: { id: number; authorId: number };
  reply: {
    id?: number;
    time: string;
    author: User;
    content: string;
    usersMetioned: UserMetioned[];
  };
}>) {
  const [userId, setUserId] = useState<number | null>(null);
  return (
    <div
      className={reply.id && userId ? "my-5m" : undefined}
      id={(reply.id ?? 0).toString()}
    >
      {reply.id && userId && (
        <ContextViewer
          discussionAuthor={discussion.authorId}
          discussionId={discussion.id}
          userId={userId}
          replyId={reply.id}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          userMetioned={reply.usersMetioned.find((user) => user.id === userId)!}
          key={userId}
        />
      )}
      <div className="reply position-relative">
        <UserAvatar className="reply-avatar" user={reply.author} />
        <div className="reply-card rounded-4 shadow-bssb mb-4s">
          <div className="reply-meta bg-light-bssb rounded-top-4 pe-4 py-2">
            <UserInfo user={reply.author} />
            {reply.author.id === discussion.authorId ? (
              <span
                className="ms-1 badge position-relative bg-teal d-inline-block"
                style={{ top: "-.15em", left: ".08em", marginRight: ".08em" }}
              >
                楼主
              </span>
            ) : (
              ""
            )}
            <span className="float-end text-body-tertiary">
              <span className="d-none d-md-inline">{reply.time}</span>
              {reply.id !== undefined ? (
                <Link
                  href={`/r/${reply.id}`}
                  className="ms-2 link-secondary position-relative"
                  style={{ fontSize: ".8em", top: "-.2em" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    className="bi bi-box-arrow-up-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
                    />
                    <path
                      fillRule="evenodd"
                      d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"
                    />
                  </svg>
                </Link>
              ) : undefined}
            </span>
          </div>
          <div className="reply-content pe-4 py-2 position-relative">
            {children}
            <Content
              discussionAuthor={discussion.authorId}
              content={reply.content}
              usersMetioned={reply.usersMetioned}
              userIdState={[userId, setUserId]}
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
    </div>
  );
}
