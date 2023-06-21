"use client";

import useSWRInfinite from "swr/infinite";
import InfiniteScroll from "react-infinite-scroll-component";
import type { DiscussionWithContent } from "@/lib/discussion";
import fetcher from "@/lib/fetcher";
import Spinner from "@/components/Spinner";
import DiscussionEntry from "@/components/DiscussionEntry";

interface PageData {
  data: (DiscussionWithContent & { time: string })[];
  nextCursor: number;
}

export default function UserDiscussions({ uid }: { uid: string }) {
  const { data, size, setSize, isValidating } = useSWRInfinite<PageData>(
    (pageIndex: number, previousPageData: PageData) =>
      previousPageData && !previousPageData.data.length
        ? null
        : `/user/${uid}/discussions/data${
            pageIndex ? `?cursor=${previousPageData.nextCursor}` : ""
          }`,
    fetcher
  );

  return (
    <>
      <InfiniteScroll
        dataLength={data?.reduce((c, a) => c + a.data.length, 0) ?? 0}
        next={() => setSize(size + 1)}
        hasMore={Boolean(data?.[data.length - 1].data.length)}
        loader
        style={{ overflow: "inherit" }}
        scrollThreshold="1024px"
        endMessage={
          isValidating || (
            <p className="mt-4x text-center text-body-tertiary">没有更多了哦</p>
          )
        }
      >
        {data?.map(({ data: discussions }) =>
          discussions.map((discussion) => (
            <DiscussionEntry
              discussion={discussion}
              key={discussion.id}
              decoratorBreakpoint="md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                fill="currentColor"
                className="bi bi-chat-dots"
                viewBox="0 0 16 16"
                style={{ position: "relative", top: "-.1125em" }}
              >
                <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z" />
              </svg>{" "}
              {discussion.replyCount}
              <span className="float-end">{discussion.time}</span>
            </DiscussionEntry>
          ))
        )}
      </InfiniteScroll>
      {isValidating && <Spinner />}
    </>
  );
}
