"use client";

import { useState } from "react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import UserInfo from "@/components/UserInfo";
import type { User } from "@prisma/client";
import Content from "./Content";

type Data = {
  id: number;
  discussionId: number;
  authorId: number;
  time: string;
  content: string;
  usersMetioned: User[];
};

export default function ContextViewer({
  discussionId,
  userId,
  replyId,
  userMetioned,
}: {
  discussionId: number;
  userId: number;
  replyId: number;
  userMetioned: User;
}) {
  const [pageIndex, setPageIndex] = useState(0);
  const { data, isLoading } = useSWR<{ id: number }>(
    `/${discussionId}/context/${userId}?reply=${replyId}&offset=${pageIndex}`,
    fetcher
  );
  return (
    <div className="reply-context bg-body rounded-top-4 shadow pe-4 pt-3x pb-4x">
      <div className="d-flex">
        <div className="me-auto">
          {/* eslint-disable-next-line no-nested-ternary */}
          {isLoading ? (
            <div
              className="text-center text-body-secondary"
              style={{ height: "5.375em", paddingTop: "2.1875em" }}
            >
              加载中
            </div>
          ) : Object.keys(data ?? {}).length ? (
            <div>
              <div>
                <UserInfo user={userMetioned} />
              </div>
              {/* eslint-disable-next-line no-nested-ternary */}
              {pageIndex === 0 ? (
                <span
                  className="text-body-secondary"
                  style={{ fontSize: ".8em" }}
                >
                  推测的上文，发布于 {(data as Data).time}
                </span>
              ) : pageIndex < 0 ? (
                <span
                  className="text-body-tertiary"
                  style={{ fontSize: ".8em" }}
                >
                  可能的上文，发布于 {(data as Data).time}
                </span>
              ) : (
                <span
                  className="text-body-tertiary"
                  style={{ fontSize: ".8em" }}
                >
                  本层后发布，发布于 {(data as Data).time}
                </span>
              )}
              <Content
                discussionAuthor={(data as Data).authorId}
                content={(data as Data).content}
                usersMetioned={(data as Data).usersMetioned}
              />
            </div>
          ) : (
            <div
              className="text-center text-body-secondary"
              style={{ height: "5.375em", paddingTop: "2.1875em" }}
            >
              空空如也
            </div>
          )}
        </div>
        <div className="ps-2">
          <button
            className="btn btn-light shadow-sm d-block border-0 rounded-circle mb-1x"
            type="submit"
            disabled={Object.keys(data ?? {}).length === 0 && pageIndex <= 0}
            onClick={() => setPageIndex(pageIndex - 1)}
            style={{ width: "2.5em", height: "2.5em" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              fill="currentColor"
              className="bi bi-chevron-up text-body-secondary"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
              />
            </svg>
          </button>
          <button
            className="btn btn-light shadow-sm d-block border-0 rounded-circle"
            type="submit"
            disabled={Object.keys(data ?? {}).length === 0 && pageIndex > 0}
            onClick={() => setPageIndex(pageIndex + 1)}
            style={{ width: "2.5em", height: "2.5em" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              fill="currentColor"
              className="bi bi-chevron-down text-body-secondary"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
