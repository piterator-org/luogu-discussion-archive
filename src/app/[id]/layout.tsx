import { notFound } from "next/navigation";
import { collection, users } from "@/lib/mongodb";
import getForumName from "@/lib/forums";
import { getDiscussionUrl, getForumUrl } from "@/lib/luogu";
import UserInfo from "./UserInfo";
import "./markdown.css";
import Reply from "./Reply";

export default async function Page({
  children,
  params,
}: React.PropsWithChildren<{ params: { id: string } }>) {
  const { content, forum, title, ...discussion } =
    (await (
      await collection
    ).findOne(
      { _id: parseInt(params.id, 10) },
      { projection: { _id: 0, replies: 0 } }
    )) ?? notFound();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const author = (await (await users).findOne({ _id: discussion.author }))!;
  const time = discussion.time.toLocaleString("zh").split(":", 2).join(":");
  return (
    <div className="row">
      <div className="col-lg-4 col-md-5 col-12 order-md-last mb-4s">
        <div className="rounded-4 shadow px-4 py-3">
          <div className="mb-2 fs-2 fw-semibold d-block d-md-none">{title}</div>
          <ul className="list-group">
            <li className="d-flex justify-content-between lh-lg">
              <span className="fw-semibold">板块</span>
              <a
                className="link-primary text-decoration-none"
                href={getForumUrl(forum)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {getForumName(forum)}
              </a>
            </li>
            <li className="d-flex justify-content-between lh-lg">
              <span className="fw-semibold">楼主</span>
              <span>
                <UserInfo user={author} />
              </span>
            </li>
            <li className="d-flex justify-content-between lh-lg">
              <span className="fw-semibold">发布时间</span>
              <span className="text-muted">{time}</span>
            </li>
          </ul>
          <div className="mt-2 mb-1">
            <a
              className="btn btn-outline-secondary shadow-sm"
              href={getDiscussionUrl(parseInt(params.id, 10))}
              target="_blank"
              rel="noopener noreferrer"
            >
              查看原帖
            </a>
            <button
              type="button"
              className="btn btn-outline-primary shadow-sm ms-2"
            >
              更新帖子
            </button>
          </div>
        </div>
      </div>
      <div className="col-lg-8 col-md-7 col-12">
        <div className="bg-white rounded-4 shadow mb-4s px-4 py-3 fs-2 fw-semibold d-none d-md-block">
          {title}
        </div>
        <Reply reply={{ time, author, content }} />
        {children}
      </div>
    </div>
  );
}
