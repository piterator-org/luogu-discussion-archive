"use client";

import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import InfiniteScroll from "react-infinite-scroll-component";
import type { User } from "@prisma/client";
import type { UserMetioned } from "@/lib/serialize-reply";
import fetcher from "@/lib/fetcher";
import Reply from "@/components/replies/Reply";
import Spinner from "@/components/Spinner";

interface PageData {
  data: {
    id: number;
    time: string;
    author: User;
    content: string;
    usersMetioned: UserMetioned[];
    discussion: {
      id: number;
      snapshots: {
        title: string;
        authorId: number;
      }[];
    };
  }[];
  nextCursor: number;
}

export default function UserReplies({ uid }: { uid: string }) {
  const { data, size, setSize, isValidating } = useSWRInfinite<PageData>(
    (pageIndex: number, previousPageData: PageData) =>
      previousPageData && !previousPageData.data.length
        ? null
        : `/user/${uid}/replies/data${
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
        {data?.map(({ data: replies }) =>
          replies.map((reply) => (
            <div key={reply.id}>
              <Reply
                reply={reply}
                discussion={{
                  id: reply.discussion.id,
                  authorId: reply.discussion.snapshots[0].authorId,
                }}
              >
                <div className="mt-2 fw-medium text-body-tertiary">
                  于帖子{" "}
                  <Link
                    className="text-decoration-none"
                    href={`/${reply.discussion.id}`}
                  >
                    {reply.discussion.snapshots[0].title}
                  </Link>
                  ：
                </div>
              </Reply>
            </div>
          )),
        )}
      </InfiniteScroll>
      {isValidating && <Spinner />}
    </>
  );
}
