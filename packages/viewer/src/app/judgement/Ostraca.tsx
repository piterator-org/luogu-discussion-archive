"use client";

import useSWRInfinite from "swr/infinite";
import InfiniteScroll from "react-infinite-scroll-component";
import fetcher from "@/lib/fetcher";
import Spinner from "@/components/Spinner";
import Ostracon from "@/components/Ostracon";
import { LatestUser } from "@/lib/user";

interface PageData {
  data: { user: LatestUser; time: string; content: string }[];
  nextCursor: string;
}

export default function Ostraca() {
  const { data, size, setSize, isValidating } = useSWRInfinite<PageData>(
    (pageIndex: number, previousPageData: PageData) =>
      previousPageData && !previousPageData.data.length
        ? null
        : `/judgement/data${
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
        {data?.map(({ data: ostraca }) =>
          ostraca.map((ostracon) => (
            <Ostracon
              ostracon={{ ...ostracon, time: new Date(ostracon.time) }}
              key={`${ostracon.time}${ostracon.user.id}`}
            />
          )),
        )}
      </InfiniteScroll>
      {isValidating && <Spinner />}
    </>
  );
}
