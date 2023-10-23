"use client";

import useSWRInfinite from "swr/infinite";
import InfiniteScroll from "react-infinite-scroll-component";
import fetcher from "@/lib/fetcher";
import Spinner from "@/components/Spinner";
import Ostracon from "@/components/Ostracon";
import type { LatestUser } from "@/lib/user";
import { getPermissionNames } from "@/lib/judgement";

interface PageData {
  data: {
    user: LatestUser;
    time: string;
    permissionGranted: number;
    permissionRevoked: number;
    reason: string;
  }[];
  nextCursor: string;
}

export default function UserJudgements({ uid }: { uid: string }) {
  const { data, size, setSize, isValidating } = useSWRInfinite<PageData>(
    (pageIndex: number, previousPageData: PageData) =>
      previousPageData && !previousPageData.data.length
        ? null
        : `/user/${uid}/judgements/data${
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
        {data?.map(({ data: judgements }) =>
          judgements.map((judgement) => (
            <Ostracon
              ostracon={{ ...judgement, time: new Date(judgement.time) }}
              key={`${judgement.time}${judgement.user.id}`}
            >
              <ul>
                {getPermissionNames(judgement.permissionGranted).map((name) => (
                  <li>
                    授予 <code>{name}</code> 权限
                  </li>
                ))}
                {getPermissionNames(judgement.permissionRevoked).map((name) => (
                  <li>
                    撤销 <code>{name}</code> 权限
                  </li>
                ))}
              </ul>
              {judgement.reason}。
            </Ostracon>
          )),
        )}
      </InfiniteScroll>
      {isValidating && <Spinner />}
    </>
  );
}
