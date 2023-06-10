import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getDiscussionUrl, getForumName, getForumUrl } from "@/lib/luogu";
import stringifyTime from "@/lib/time";
import UserInfo from "@/components/UserInfo";
import "./markdown.css";
import UpdateButton from "@/components/UpdateButton";
import Reply from "./Reply";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) notFound();
  const discussion = await prisma.discussion.findUnique({
    select: {
      snapshots: {
        select: { title: true },
        orderBy: { time: "desc" },
        take: 1,
      },
    },
    where: { id },
  });
  return { title: discussion?.snapshots[0].title };
}

export default async function Page({
  children,
  params,
}: React.PropsWithChildren<{ params: { id: string } }>) {
  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) notFound();
  const {
    replyCount,
    snapshots: [{ title, forum, author, content, time: updatedAt }],
    ...discussion
  } = (await prisma.discussion.findUnique({
    where: { id },
    select: {
      time: true,
      replyCount: true,
      snapshots: {
        select: {
          time: true,
          title: true,
          forum: true,
          author: true,
          content: true,
        },
        orderBy: { time: "desc" },
        take: 1,
      },
    },
  })) ?? notFound();
  const time = stringifyTime(discussion.time);
  return (
    <div className="row px-2 px-md-0">
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
              <span className="fw-semibold">历史最多回复</span>
              <span className="text-muted">{replyCount}</span>
            </li>
            <li className="d-flex justify-content-between lh-lg">
              <span className="fw-semibold">已保存回复</span>
              <span className="text-muted">
                {prisma.reply.count({ where: { discussionId: id } })}
              </span>
            </li>
            <li className="d-flex justify-content-between lh-lg">
              <span className="fw-semibold">发布时间</span>
              <span className="text-muted">{time}</span>
            </li>
            <li className="d-flex justify-content-between lh-lg">
              <span className="fw-semibold">上次更新</span>
              <span className="text-muted">
                {updatedAt.toLocaleString("zh")}
              </span>
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
            <UpdateButton target={params.id}>更新帖子</UpdateButton>
          </div>
        </div>
      </div>
      <div className="col-lg-8 col-md-7 col-12">
        <div className="bg-body rounded-4 shadow mb-4s px-4 py-3 fs-2 fw-semibold d-none d-md-block">
          {title}
        </div>
        <Reply reply={{ time, author, content }} />
        {children}
      </div>
    </div>
  );
}
