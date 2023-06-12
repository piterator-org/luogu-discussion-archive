"use client";

import "highlight.js/styles/tokyo-night-dark.css";
import { useState } from "react";
import type { User } from "@prisma/client";
import UserAvatar from "@/components/UserAvatar";
import UserInfo from "@/components/UserInfo";
import Content from "./Content";
import ContextViewer from "./ContextViewer";

export default function Reply({
  discussion,
  reply,
}: {
  discussion: { id: number; authorId: number };
  reply: {
    id?: number;
    time: string;
    author: User;
    content: string;
    usersMetioned: (User & {
      numReplies: number;
    })[];
  };
}) {
  const [userId, setUserId] = useState<number | null>(null);
  return (
    <div className={reply.id && userId ? "my-5m" : undefined}>
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
        <div className="reply-card bg-white rounded-4 shadow mb-4s">
          <div className="reply-meta bg-light rounded-top-4 pe-4 py-2">
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
            <span className="float-end text-body-tertiary d-none d-md-inline">
              {reply.time}
            </span>
          </div>
          <div className="reply-content pe-4 py-2 position-relative">
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
