import { Suspense } from "react";
import Spinner from "@/components/Spinner";
import Discussions from "./Discussions";
import Users from "./Users";

export const dynamic = "force-dynamic";

export const metadata = { title: "发现 - 洛谷帖子保存站" };

export default function Page() {
  return (
    <>
      <div className="mt-6s px-3 px-md-0 mb-5s">
        <div
          className="input-group input-group-lg mx-auto"
          style={{ maxWidth: "40em" }}
        >
          <input
            className="form-control shadow-bssb rounded-start-4 border-0"
            autoComplete="off"
            placeholder="帖子关键词、发布者"
            disabled
          />
          <button
            className="btn btn-primary shadow-bssb rounded-end-4"
            type="button"
            disabled
          >
            即将上线
          </button>
        </div>
      </div>
      <div className="px-2 px-md-0 py-5">
        <div className="row">
          <div className="col-12 col-md-8 col-xl-9">
            <div className="rounded-4 shadow-bssb mb-4s px-3x pt-3x">
              <div className="row">
                <Suspense fallback={<Spinner className="mt-2 mb-4" />}>
                  <Discussions />
                </Suspense>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 col-xl-3">
            <div className="rounded-4 shadow-bssb px-4 px-md-3x pt-3x pb-2x">
              <div className="mb-2 fs-4 fw-semibold">龙王榜（7 天）</div>
              <Suspense fallback={<Spinner className="mt-4 mb-3" />}>
                <Users />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
