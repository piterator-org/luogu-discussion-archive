"use client";

import { useState } from "react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { ReplyWithLatestContent } from "@/lib/reply";
import { ReplyTakedown } from "@prisma/client";
import stringifyTime from "@/lib/time";
import { LatestUser } from "@/lib/user";
import UserInfo from "@/components/UserInfo";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import Content from "./Content";

interface ReplyData extends ReplyWithLatestContent {
  takedown: ReplyTakedown | null;
}

interface Data {
  reply: ReplyData;
}

export default function ContextViewer({
  discussionAuthor,
  discussionId,
  userId,
  replyId,
}: {
  discussionAuthor: number;
  discussionId: number;
  userId: number;
  replyId: number;
}) {
  const [pageIndex, setPageIndex] = useState(0);
  const { data, isLoading } = useSWR<Data>(
    `/${discussionId}/context/${userId}?reply=${replyId}&offset=${pageIndex}`,
    fetcher,
  );
  const { data: user, isLoading: isUserLoading } = useSWR<LatestUser>(
    `/user/${userId}/info`,
    fetcher,
  );

  return (
    <div className="reply-context bg-body rounded-top-4 shadow-bssb pe-4 pt-3x pb-4x">
      <div className="d-flex">
        <div className="me-auto">
          {/* eslint-disable-next-line no-nested-ternary */}
          {isLoading || isUserLoading ? (
            <div
              className="text-body-secondary mb-2 d-flex"
              style={{ minHeight: "5.375em", alignItems: "center" }}
            >
              <div>加载中</div>
            </div>
          ) : Object.keys(data ?? {}).length ? (
            <div>
              <div>{user ? <UserInfo user={user} /> : null}</div>
              {/* eslint-disable-next-line no-nested-ternary */}
              {pageIndex === 0 ? (
                <span
                  className="text-body-secondary"
                  style={{ fontSize: ".8em" }}
                >
                  推测的上文，发布于 {stringifyTime(data!.reply.time)}
                </span>
              ) : pageIndex < 0 ? (
                <span
                  className="text-body-tertiary"
                  style={{ fontSize: ".8em" }}
                >
                  可能的上文，发布于 {stringifyTime(data!.reply.time)}
                </span>
              ) : (
                <span
                  className="text-body-tertiary"
                  style={{ fontSize: ".8em" }}
                >
                  本层后发布，发布于 {stringifyTime(data!.reply.time)}
                </span>
              )}
              <Content
                postAuthor={discussionAuthor}
                content={data!.reply.snapshots[0].content}
              />
            </div>
          ) : (
            <div
              className="text-body-secondary mb-2 d-flex"
              style={{ minHeight: "5.375em", alignItems: "center" }}
            >
              <div>
                空空如也，真好奇
                {user ? <UserInfo user={user} /> : " TA "} 到底说过些什么呢？
              </div>
            </div>
          )}
        </div>
        <div className="ps-2">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            className="btn btn-light-bssb shadow-bssb-sm d-block border-0 rounded-circle mb-1x"
            type="submit"
            disabled={Object.keys(data ?? {}).length === 0 && pageIndex <= 0}
            onClick={() => setPageIndex(pageIndex - 1)}
            style={{ width: "2.5em", height: "2.5em" }}
          >
            <BsChevronUp className="text-body-secondary" />
          </button>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            className="btn btn-light-bssb shadow-bssb-sm d-block border-0 rounded-circle"
            type="submit"
            disabled={Object.keys(data ?? {}).length === 0 && pageIndex > 0}
            onClick={() => setPageIndex(pageIndex + 1)}
            style={{ width: "2.5em", height: "2.5em" }}
          >
            <BsChevronDown className="text-body-secondary" />
          </button>
        </div>
      </div>
    </div>
  );
}
