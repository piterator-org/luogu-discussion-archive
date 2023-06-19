"use client";

import useSWRInfinite from "swr/infinite";
import InfiniteScroll from "react-infinite-scroll-component";
import type { Discussion } from "@/lib/discussion";
import fetcher from "@/lib/fetcher";
import Spinner from "@/components/Spinner";
import DiscussionEntry from "@/components/DiscussionEntry";

interface PageData {
  data: Discussion[];
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
      >
        {data?.map(({ data: discussions }) =>
          discussions.map((discussion) => (
            <DiscussionEntry discussion={discussion} key={discussion.id} />
          ))
        )}
      </InfiniteScroll>
      {isValidating && <Spinner />}
    </>
  );
}
