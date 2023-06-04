import { collection, users } from "@/lib/mongodb";
import UserInfo from "../utils/UserInfo";

const NUM_DISCUSSIONS_TOP_CHARTS = parseInt(
  process.env.NUM_DISCUSSIONS_TOP_CHARTS ?? "50",
  10
);

export default async function Page() {
  const mostReplies = await (
    await collection
  )
    .find({}, { projection: { replies: 0 } })
    .sort({ replyCount: -1 })
    .limit(NUM_DISCUSSIONS_TOP_CHARTS)
    .toArray();
  return (
    <div className="mb-5x px-4 py-5">
      <h2 className="pb-2 text-center">排行榜</h2>
      <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
        <div className="col">
          <div className="rounded-4 shadow px-4 py-3">
            <h3 className="fs-4 text-body-emphasis d-none d-md-block">
              最高楼层
            </h3>
            <ul className="list-group list-group-flush">
              {mostReplies.map((discussion) => (
                <li className="list-group-item d-flex">
                  {discussion._id}:{discussion.title}({discussion.replyCount}{" "}
                  floors)
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col">
          <div className="rounded-4 shadow px-4 py-3">
            <h3 className="fs-4 text-body-emphasis d-none d-md-block">
              最新发布
            </h3>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex">1111</li>
              <li className="list-group-item d-flex">1111</li>
            </ul>
          </div>
        </div>
        <div className="feature col">
          <div className="rounded-4 shadow px-4 py-3">
            <h3 className="fs-4 text-body-emphasis d-none d-md-block">
              最多点击
            </h3>
            <p className="my-6 text-center text-muted">即将上线</p>
          </div>
        </div>
      </div>
    </div>
  );
}
