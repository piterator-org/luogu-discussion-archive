"use client";

import { useState } from "react";
import useSWRInfinite from "swr/infinite";
import type { User } from "@prisma/client";
import fetcher from "@/lib/fetcher";
import PageButtons from "@/components/PageButtons";
import Reply from "./Reply";

type PageData = {
  data: {
    id: number;
    time: string;
    author: User;
    content: string;
    usersMetioned: User[];
  }[];
  nextCursor: number;
};

export default function InfiniteScroll({
  discussion,
  pagination,
}: {
  discussion: { id: number; authorId: number };
  pagination: {
    numPages: number;
    pagesLocalAttachedFront: boolean;
    pagesLocalAttachedBack: boolean;
    pagesLocal: number[];
  };
}) {
  const getKey = (pageIndex: number, previousPageData: PageData) => {
    // 已经到最后一页
    if (previousPageData && !previousPageData.data) return null;

    // 在首页时，没有 `previousPageData`
    if (pageIndex === 0) return `/${discussion.id}/replies?limit=10`;

    // 将游标添加到 API
    return `/${discussion.id}/replies?cursor=${previousPageData.nextCursor}&limit=10`;
  };

  const { data, size, setSize } = useSWRInfinite<PageData>(getKey, fetcher);

  const [showPageButtons, setShowPageButtons] = useState<boolean>(true);

  return (
    <>
      {data?.map((replies) =>
        replies.data.map((reply) => (
          <Reply discussion={discussion} reply={reply} key={reply.id} />
        ))
      )}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className="bg-body rounded-4 shadow my-4s px-4 py-2x py-md-3 text-center link-primary text-decoration-none cursor-pointer"
        onClick={() => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          setSize(size + 1);
          setShowPageButtons(false);
        }}
      >
        加载更多
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          fill="currentColor"
          className="bi bi-three-dots ms-1"
          viewBox="0 0 16 16"
        >
          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        </svg>
      </div>
      {pagination.numPages > 1 && (
        <div
          className={`bg-body rounded-4 shadow my-4s px-4 py-3 py-md-4 text-center ${
            showPageButtons ? "" : "d-none"
          }`}
        >
          <PageButtons
            ellipsisFront={!pagination.pagesLocalAttachedFront}
            ellipsisBack={!pagination.pagesLocalAttachedBack}
            numPages={pagination.numPages}
            pagesLocal={pagination.pagesLocal}
            generatorUrl={(curPage: number) => `/${discussion.id}/${curPage}`}
          />
        </div>
      )}
    </>
  );
}
