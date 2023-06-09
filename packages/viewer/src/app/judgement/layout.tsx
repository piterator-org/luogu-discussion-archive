import UpdateButton from "@/components/UpdateButton";
import prisma from "@/lib/prisma";
import { judgementUrl } from "@/lib/luogu";
import React from "react";

export const dynamic = "force-dynamic";

export default function Page({ children }: React.PropsWithChildren) {
  return (
    <div className="row px-2 px-md-0">
      <div className="col-lg-4 col-md-5 col-12 order-md-last mb-4s">
        <div className="rounded-4 shadow px-4 py-3">
          <div className="mb-2 fs-2 fw-semibold">陶片放逐</div>
          <ul className="list-group">
            <li className="d-flex justify-content-between lh-lg">
              <span className="fw-semibold">放逐令数量</span>
              <span className="text-muted">{prisma.judgement.count()}</span>
            </li>
          </ul>
          <div className="mt-2 mb-1">
            <a
              className="btn btn-outline-secondary shadow-sm"
              href={judgementUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              查看原网页
            </a>
            <UpdateButton target="judgement">更新陶片放逐</UpdateButton>
          </div>
        </div>
      </div>
      <div className="col-lg-8 col-md-7 col-12">{children}</div>
    </div>
  );
}
