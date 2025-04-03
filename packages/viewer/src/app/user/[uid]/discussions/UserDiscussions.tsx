"use client";

import useSWRInfinite from "swr/infinite";
import InfiniteScroll from "react-infinite-scroll-component";
import type { PostWithLatestContent } from "@/lib/post";
import Content from "@/components/replies/Content";
import fetcher from "@/lib/fetcher";
import Spinner from "@/components/Spinner";
import DiscussionEntry from "@/components/DiscussionEntry";
import { BsChatDots } from "react-icons/bs";
import stringifyTime from "@/lib/time";

interface PageData {
  data: PostWithLatestContent[];
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
    fetcher,
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
              metaBottom={
                <>
                  <BsChatDots
                    width="1em"
                    height="1em"
                    style={{ position: "relative", top: "-.1125em" }}
                  />{" "}
                  {discussion.replyCount}
                  <span className="float-end">
                    {stringifyTime(discussion.time)}
                  </span>
                </>
              }
            >
              <Content
                postAuthor={discussion.snapshots[0].author.id}
                content={discussion.snapshots[0].content}
                // usersMetioned={discussion.usersMetioned}
              />
            </DiscussionEntry>
          )),
        )}
      </InfiniteScroll>
      {isValidating && <Spinner />}
    </>
  );
}
