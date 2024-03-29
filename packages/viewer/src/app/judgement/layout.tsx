import { judgementUrl } from "@/lib/luogu";
import UpdateButton from "@/components/UpdateButton";
import JudgementCount from "./JudgementCount";

export const dynamic = "force-dynamic";

export const metadata = { title: "陶片放逐 - 洛谷帖子保存站" };

export default function Page({ children }: React.PropsWithChildren) {
  return (
    <div className="row px-2 px-md-0">
      <div className="col-lg-4 col-md-5 col-12 order-md-last mb-4s">
        <div className="rounded-4 shadow-bssb px-4 py-3">
          <div className="mb-2 fs-2 fw-semibold">陶片放逐</div>
          <ul className="list-group">
            <li className="d-flex justify-content-between lh-lg">
              <span className="fw-semibold">放逐令数量</span>
              <span className="text-muted">
                <JudgementCount />
              </span>
            </li>
          </ul>
          <div className="mt-2 mb-1">
            <a
              className="btn btn-outline-secondary shadow-bssb-sm"
              href={judgementUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              查看原网页
            </a>
            <UpdateButton className="ms-2" target="judgement">
              更新陶片放逐
            </UpdateButton>
          </div>
        </div>
      </div>
      <div className="col-lg-8 col-md-7 col-12">{children}</div>
    </div>
  );
}
