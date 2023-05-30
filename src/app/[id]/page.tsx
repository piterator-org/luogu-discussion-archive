import { notFound } from "next/navigation";
import Image from "next/image";
import { collection, users } from "@/lib/mongodb";
import UserInfo from "./UserInfo";
import ForumName from "../ForumName";
import "../markdown.css";

export default async function Page({ params }: { params: { id: string } }) {
  const { author, content, forum, replies, time } =
    (await (
      await collection
    ).findOne({
      _id: parseInt(params.id, 10),
    })) ?? notFound();
  const r = await Promise.all(
    [{ author, time, content }, ...replies].map((reply) =>
      users
        .then((u) => u.findOne({ _id: reply.author }))
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .then((u) => ({ ...reply, author: u! }))
    )
  );
  return (
    <div>
      <div className="row">
        <div className="col-lg-4 col-md-5 col-12 order-md-last mb-4s">
          <div className="rounded-4 shadow px-4 py-3">
            <div className="mb-2 fs-2 fw-semibold d-block d-md-none">标题</div>
            <ul className="list-group">
              <li className="d-flex justify-content-between lh-lg">
                <span className="fw-semibold">板块</span>
                <span className="text-muted">{ForumName(forum)}</span>
              </li>
              <li className="d-flex justify-content-between lh-lg">
                <span className="fw-semibold">楼主</span>
                <span className="text-muted">{r[0].author.username}</span>
              </li>
              <li className="d-flex justify-content-between lh-lg">
                <span className="fw-semibold">发布时间</span>
                <span className="text-muted">
                  {r[0].time.toLocaleString("zh").split(":", 2).join(":")}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-8 col-md-7 col-12">
          <div className="bg-white rounded-4 shadow mb-4s px-4 py-3 fs-2 fw-semibold d-none d-md-block">
            标题
          </div>
          {r.map((reply) => (
            <div className="reply list-group-item position-relative">
              <a
                href={`https://www.luogu.com.cn/user/${reply.author._id}`}
                className="reply-avatar"
              >
                <Image
                  src={`https://cdn.luogu.com.cn/upload/usericon/${reply.author._id}.png`}
                  className="rounded-circle shadow"
                  fill
                  alt={reply.author._id.toString()}
                />
              </a>
              <div className="reply-card bg-white rounded-4 shadow mb-4s">
                <div className="reply-meta bg-light rounded-top-4 pe-4 py-2">
                  {/* <span className="font-monospace align-top text-body-tertiary me-1">@</span> */}
                  <UserInfo user={reply.author} />
                  <span className="float-end text-body-tertiary d-none d-md-inline">
                    {reply.time.toLocaleString("zh").split(":", 2).join(":")}
                  </span>
                </div>
                <div className="reply-content pe-4 py-2">
                  <div
                    className="markdown"
                    /* eslint-disable-next-line react/no-danger */
                    dangerouslySetInnerHTML={{ __html: reply.content }}
                  />
                  <span
                    className="text-end text-body-tertiary d-block d-md-none"
                    style={{ fontSize: ".8rem" }}
                  >
                    {r[0].time.toLocaleString("zh").split(":", 2).join(":")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
