"use client";

import useSWRInfinite from "swr/infinite";
import type { User } from "@prisma/client";
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

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export default function InfiniteScroll({ id }: { id: number }) {
  const getKey = (pageIndex: number, previousPageData: PageData) => {
    // 已经到最后一页
    if (previousPageData && !previousPageData.data) return null;

    // 在首页时，没有 `previousPageData`
    if (pageIndex === 0) return `/${id}/replies?limit=10`;

    // 将游标添加到 API
    return `/${id}/replies?cursor=${previousPageData.nextCursor}&limit=10`;
  };

  const { data, size, setSize } = useSWRInfinite<PageData>(getKey, fetcher);
  return (
    <>
      {data?.map((replies) =>
        replies.data.map((reply) => <Reply reply={reply} key={reply.id} />)
      )}
      <button
        className="btn btn-primary"
        type="button"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={() => setSize(size + 1)}
      >
        Load more
      </button>
    </>
  );
}
