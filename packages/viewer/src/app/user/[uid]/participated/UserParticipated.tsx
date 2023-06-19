"use client";

import useSWRInfinite from "swr/infinite";
import InfiniteScroll from "react-infinite-scroll-component";
import type { User } from "@prisma/client";
import type { UserMetioned } from "@/lib/serialize-reply";
import fetcher from "@/lib/fetcher";
import Spinner from "@/components/Spinner";

interface PageData {
  data: {
    id: number;
    time: Date;
    snapshots: {
      time: Date;
      title: string;
      author: User;
      forum: string;
    }[];
    replyCount: number;
    replies: {
      content: string;
      time: string;
      usersMetioned: UserMetioned[];
      id: number;
      discussionId: number;
      authorId: number;
    }[];
  }[];
  nextCursor: number;
}

export default function UserParticipated({ uid }: { uid: string }) {
  const { data, size, setSize, isValidating } = useSWRInfinite<PageData>(
    (pageIndex: number, previousPageData: PageData) =>
      previousPageData && !previousPageData.data.length
        ? null
        : `/user/${uid}/participated/data${
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
            <pre key={discussion.id}>{JSON.stringify(discussion)}</pre>
          ))
        )}
      </InfiniteScroll>
      {isValidating && <Spinner />}
    </>
  );
}
