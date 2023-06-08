"use client";

import { useState } from "react";
import type { User } from "@prisma/client";
import TopChart from "./TopChart";

export default function Page({
  mostReplies,
  mostRecent,
}: {
  mostReplies: {
    id: number;
    author: User;
    title: string;
    time: Date;
    replyCount: number;
  }[];
  mostRecent: {
    id: number;
    author: User;
    title: string;
    time: Date;
    replyCount: number;
  }[];
}) {
  const [selected, setSelected] = useState<string>("most-replies");

  return (
    <div className="pt-5 pb-3 pb-md-3x px-2 px-md-0">
      <h1 className="mb-4x text-center">排行榜</h1>
      <select
        className="form-select form-select-lg d-block d-md-none border-0 rounded-3 shadow-sm mb-4m"
        onChange={({ target: { value } }) => setSelected(value)}
      >
        <option value="most-replies" selected>
          最高楼层
        </option>
        <option value="most-recent">最新发布</option>
        <option value="most-clicked">最多点击</option>
      </select>
      <div className="row g-md-4m row-cols-1 row-cols-md-3">
        <div
          className={`col d-md-block ${
            selected !== "most-replies" ? "d-none" : ""
          }`}
        >
          <h4 className="pb-1 text-center d-none d-md-block mb-4s">最高楼层</h4>
          <TopChart discussions={mostReplies} />
        </div>
        <div
          className={`col d-md-block ${
            selected !== "most-recent" ? "d-none" : ""
          }`}
        >
          <h4 className="pb-1 text-center d-none d-md-block mb-4s">最新发布</h4>
          <TopChart discussions={mostRecent} />
        </div>
        <div
          className={`col d-md-block ${
            selected !== "most-clicked" ? "d-none" : ""
          }`}
        >
          <h4 className="pb-1 text-center d-none d-md-block mb-4s">最多点击</h4>
          <div className="rounded-4 shadow px-4 py-3">
            <p className="my-5x text-center text-muted">即将上线</p>
          </div>
        </div>
      </div>
    </div>
  );
}
