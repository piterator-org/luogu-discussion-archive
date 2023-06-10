"use client";

import { useState } from "react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";

export default function ContextViewer({
  discussionId,
  userId,
  replyId,
}: {
  discussionId: number;
  userId: number;
  replyId: number;
}) {
  const [pageIndex, setPageIndex] = useState(0);
  const { data } = useSWR<{ id: number }>(
    `/${discussionId}/context/${userId}?reply=${replyId}&offset=${pageIndex}`,
    fetcher
  );
  return (
    <>
      {JSON.stringify(data)}
      <button onClick={() => setPageIndex(pageIndex - 1)} type="button">
        上一条
      </button>
      <button onClick={() => setPageIndex(pageIndex + 1)} type="button">
        下一条
      </button>
    </>
  );
}
