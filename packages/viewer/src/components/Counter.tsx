"use client";

import fetcher from "@/lib/fetcher";
import useSWR from "swr";

interface Data {
  discussions: number;
  snapshots: number;
  replies: number;
  judgements: number;
}

export default function Counter({
  fallbackData,
  refreshInterval,
}: {
  fallbackData: Data | Promise<Data>;
  refreshInterval: number;
}) {
  const { data } = useSWR<Data>("/counter", fetcher, {
    fallbackData: fallbackData as Data,
    refreshInterval,
  });
  return (
    <>
      已经保存了 {data?.discussions} 个帖子（{data?.snapshots} 份快照）共{" "}
      {data?.replies} 层楼。此外，还有 {data?.judgements} 块陶片。
    </>
  );
}
