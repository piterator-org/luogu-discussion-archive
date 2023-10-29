"use client";

import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import InfiniteScroll from "react-infinite-scroll-component";
import fetcher from "@/lib/fetcher";
import Reply from "@/components/replies/Reply";
import Spinner from "@/components/Spinner";
import { ReplyWithLatestContentPostMeta } from "@/lib/reply";

interface PageData {
  data: ReplyWithLatestContentPostMeta[];
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
                reply={{
                  ...reply,
                  postId: reply.post.id,
                }}
                post={{
                  id: reply.post.id,
                  authorId: reply.post.snapshots[0].author.id,
                }}
              >
                <div className="mt-2 fw-medium text-body-tertiary">
                  于帖子{" "}
                  <Link
                    className="text-decoration-none"
                    href={`/${reply.post.id}`}
                  >
                    {reply.post.snapshots[0].title}
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
