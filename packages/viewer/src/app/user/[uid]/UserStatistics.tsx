"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";

function Placeholder() {
  return <span className="placeholder" style={{ width: "1.5em" }} />;
}

export default function UserStatistics({ uid }: { uid: number }) {
  const { data, isLoading } = useSWR<{ discussions: number; replies: number }>(
    `/user/${uid}/statistics`,
    fetcher,
  );
  return (
    <>
      <span className="fw-medium">发帖</span>{" "}
      {isLoading ? <Placeholder /> : data?.discussions} 条
      <span className="fw-medium ms-2x">回帖</span>{" "}
      {isLoading ? <Placeholder /> : data?.replies} 层
    </>
  );
}
