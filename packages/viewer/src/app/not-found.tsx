"use client";

import { useParams, usePathname } from "next/navigation";
import UpdateButton from "@/components/UpdateButton";
import { BsDatabaseX, BsJournalCode, BsThreeDots } from "react-icons/bs";

export default function Page() {
  const pathname = usePathname();
  const params = useParams();
  const { id } = params;
  return (
    <div className="my-screen-middle">
      <div className="mx-auto" style={{ width: "max-content" }}>
        <div className="fs-1 text-body-secondary">404</div>
        <div className="fs-3 text-body-tertiary mt-2">
          {Number.isNaN(parseInt(pathname.slice(1), 10)) ? (
            <>
              <BsDatabaseX
                className="me-1"
                style={{ position: "relative", top: "-.1375em" }}
              />
              数据被 fx 酱啃食了
              <BsThreeDots
                className="ms-1"
                style={{ position: "relative", top: "-.09em" }}
              />
            </>
          ) : (
            <>
              <BsJournalCode
                className="me-1"
                style={{ position: "relative", top: "-.11em" }}
              />
              帖子还没有保存哦
            </>
          )}
        </div>
        {Number.isNaN(parseInt(pathname.slice(1), 10)) || (
          <div className="mt-2x mb-1">
            <UpdateButton
              className="w-100"
              target={typeof id === "string" ? id : id[0]}
            >
              立即保存帖子
            </UpdateButton>
          </div>
        )}
        <div
          className="fs-6 mt-2 text-break"
          style={{ maxWidth: "calc(16em + .6vw)" }}
        >
          <span className="text-body-secondary">lglg.top</span>
          <span className="fw-light text-body-tertiary">{pathname}</span>
        </div>
      </div>
    </div>
  );
}
