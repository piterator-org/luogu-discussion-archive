import { Suspense } from "react";
import Spinner from "@/components/Spinner";
import TopCharts from "./TopCharts";
import MostReplied from "./MostReplied";
import MostRecent from "./MostRecent";
import MostViewed from "./MostViewed";

export const dynamic = "force-dynamic";

export const metadata = { title: "索引 - 洛谷帖子保存站" };

export default function Page() {
  return (
    <TopCharts>
      <>
        <h4 className="pb-1 text-center d-none d-md-block mb-4s">最高楼层</h4>
        <Suspense fallback={<Spinner />}>
          <MostReplied />
        </Suspense>
      </>
      <>
        <h4 className="pb-1 text-center d-none d-md-block mb-4s">最新发布</h4>
        <Suspense fallback={<Spinner />}>
          <MostRecent />
        </Suspense>
      </>
      <>
        <h4 className="pb-1 text-center d-none d-md-block mb-4s">最多点击</h4>
        <Suspense fallback={<Spinner />}>
          <MostViewed />
        </Suspense>
      </>
    </TopCharts>
  );
}
