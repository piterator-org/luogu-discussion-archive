import { notFound } from "next/navigation";
import { collection, users } from "@/lib/mongodb";
import UserInfo from "./UserInfo";
import getForumName from "../../lib/forums";
import "../markdown.css";
import Reply from "./Reply";

export default async function Page({ params }: { params: { id: string } }) {
  const { author, content, forum, replies, time, title } =
    (await (
      await collection
    ).findOne({
      _id: parseInt(params.id, 10),
    })) ?? notFound();
  const r = await Promise.all(
    [{ author, time, content }, ...replies].map((reply) =>
      users
        .then((u) => u.findOne({ _id: reply.author }))
        .then((u) => ({
          ...reply,
          time: reply.time.toLocaleString("zh").split(":", 2).join(":"),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          author: u!,
        }))
    )
  );
  return (
    <div className="row">
      <div className="col-lg-4 col-md-5 col-12 order-md-last mb-4s">
        <div className="rounded-4 shadow px-4 py-3">
          <div className="mb-2 fs-2 fw-semibold d-block d-md-none">{title}</div>
          <ul className="list-group">
            <li className="d-flex justify-content-between lh-lg">
              <span className="fw-semibold">板块</span>
              <span className="text-muted">{getForumName(forum)}</span>
            </li>
            <li className="d-flex justify-content-between lh-lg">
              <span className="fw-semibold">楼主</span>
              <span>
                <UserInfo user={r[0].author} />
              </span>
            </li>
            <li className="d-flex justify-content-between lh-lg">
              <span className="fw-semibold">发布时间</span>
              <span className="text-muted">{r[0].time}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="col-lg-8 col-md-7 col-12">
        <div className="bg-white rounded-4 shadow mb-4s px-4 py-3 fs-2 fw-semibold d-none d-md-block">
          {title}
        </div>
        {r.map((reply) => (
          <Reply reply={reply} />
        ))}
      </div>
    </div>
  );
}
