"use client";

import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";
import UserInfo from "@/components/UserInfo";

import type { ReplyWithLatestContent } from "@/lib/reply";
import stringifyTime from "@/lib/time";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { useState } from "react";
import Content from "./Content";
import ContextViewer from "./ContextViewer";

export default function Reply({
  post,
  reply,
  children,
}: React.PropsWithChildren<{
  post: { id: number; authorId: number };
  reply: ReplyWithLatestContent;
}>) {
  const [userId, setUserId] = useState<number | null>(null);
  const snapshot = reply.snapshots[0];

  return (
    <div
      className={reply.id !== -1 /* && userId */ ? "my-5m" : undefined}
      id={(reply.id ?? 0).toString()}
    >
      {reply.id !== -1 && userId && (
        <ContextViewer
          discussionAuthor={post.authorId}
          discussionId={post.id}
          userId={userId}
          replyId={reply.id}
          key={userId}
        />
      )}
      <div className="reply position-relative">
        <UserAvatar className="reply-avatar" user={snapshot.author} />
        <div className="reply-card rounded-4 shadow-bssb mb-4s">
          <div className="reply-meta bg-light-bssb rounded-top-4 pe-4 py-2">
            <UserInfo user={snapshot.author} />
            {snapshot.author.id === post.authorId ? (
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
              <span className="d-none d-md-inline">
                {stringifyTime(reply.time)}
              </span>
              {reply.id !== -1 ? (
                <Link
                  href={`/r/${reply.id}`}
                  className="ms-2 link-secondary position-relative"
                  style={{ fontSize: ".8em", top: "-.2em" }}
                >
                  <BsBoxArrowUpRight width="1em" height="1em" />
                </Link>
              ) : null}
            </span>
          </div>
          <div className="reply-content pe-4 py-2 position-relative">
            {children}
            <Content
              postAuthor={post.authorId}
              content={snapshot.content}
              userMentionedState={[userId, setUserId]}
              key={userId}
            />
            <span
              className="text-end text-body-tertiary d-block d-md-none"
              style={{ fontSize: ".8rem" }}
            >
              {stringifyTime(reply.time)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
