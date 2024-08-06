"use client";

import Spinner from "@/components/Spinner";
import UserInfo from "@/components/UserInfo";
import fetcher from "@/lib/fetcher";
import { UserSnapshot } from "@prisma/client";
import Timeline from "rsuite/Timeline";
import useSWRInfinite from "swr/infinite";
import "rsuite/Timeline/styles/index.css";
import { useState } from "react";
import { BsChevronDown, BsChevronUp, BsThreeDots } from "react-icons/bs";

const PER_PAGE = 15;

interface PageData {
  snapshots: UserSnapshot[];
  nextCursor: string;
}

export default function SnapshotTimeline({ uid }: { uid: number }) {
  const [open, setOpen] = useState(false);

  const { data, size, setSize, isValidating } = useSWRInfinite<PageData>(
    (_pageIndex, prev: PageData | null) => {
      if (prev && !prev.nextCursor) return null;
      let res = `/user/${uid}/snapshots?limit=${PER_PAGE}`;
      if (prev) res += `&offset=${prev.nextCursor}`;
      return res;
    },
    fetcher,
  );

  const timeline = (
    <>
      <Timeline endless isItemActive={Timeline.ACTIVE_FIRST}>
        {data?.map((dat) =>
          dat.snapshots?.map((snapshot) => (
            <Timeline.Item>
              <UserInfo
                user={{
                  id: uid,
                  userSnapshots: [snapshot],
                }}
                noHref
              />
              <br />
              截至 {new Date(snapshot.until).toLocaleString()}
            </Timeline.Item>
          )),
        )}
      </Timeline>
      {isValidating && <Spinner className="mt-5" />}
      {!isValidating &&
        data &&
        data[data.length - 1].snapshots.length === PER_PAGE && (
          <button
            className="btn btn-link w-100 rounded-4 py-2x py-md-3 text-center text-decoration-none"
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              setSize(size + 1);
            }}
            type="button"
          >
            加载更多
            <BsThreeDots
              className="ms-1"
              style={{ position: "relative", top: "-.09em" }}
            />
          </button>
        )}
    </>
  );

  return (
    <>
      <div className="d-md-none">
        <button
          type="button"
          className="btn btn-link w-100 d-md-none"
          onMouseDown={() => setOpen(!open)}
          style={{ textDecoration: "none" }}
        >
          用户名历史 {open ? <BsChevronUp /> : <BsChevronDown />}
        </button>

        {open && (
          <>
            {/* 对于缺失空白的一个并不优雅的解决方案 */}
            <div style={{ height: "10px" }} className="d-md-none" />
            {timeline}
          </>
        )}
      </div>
      <div className="d-md-block d-none">{timeline}</div>
    </>
  );
}
