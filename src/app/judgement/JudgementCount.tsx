"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import Placeholder from "@/components/Placeholder";

export default function JudgementCount() {
  const { data, isLoading } = useSWR<{
    judgements: number;
  }>(`/judgement/statistics`, fetcher);
  return isLoading ? <Placeholder /> : data?.judgements;
}
