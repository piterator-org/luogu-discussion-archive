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

const REPLIES_PER_PAGE = parseInt(process.env.REPLIES_PER_PAGE ?? "10", 10);

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
    if (pageIndex === 0)
      return `/${discussion.id}/replies?limit=${REPLIES_PER_PAGE}`;

    // 将游标添加到 API
    return `/${discussion.id}/replies?cursor=${previousPageData.nextCursor}&limit=${REPLIES_PER_PAGE}`;
  };

  const { data, size, setSize, isValidating, isLoading } =
    useSWRInfinite<PageData>(getKey, fetcher);

  const [showPageButtons, setShowPageButtons] = useState<boolean>(true);

  return (
    <>
      {data?.map((replies) =>
        replies.data?.map((reply) => (
          <Reply discussion={discussion} reply={reply} key={reply.id} />
        ))
      )}
      {Boolean(
        (!data?.[data.length - 1].data ||
          data?.[data.length - 1].data.length < REPLIES_PER_PAGE) &&
          !isLoading
      ) || (
        <button
          className="btn btn-link w-100 rounded-4 shadow py-2x py-md-3 text-center text-decoration-none"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            setSize(size + 1);
            setShowPageButtons(false);
          }}
          disabled={isValidating}
          type="button"
        >
          {isValidating ? "加载中" : "加载更多"}
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
        </button>
      )}
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
