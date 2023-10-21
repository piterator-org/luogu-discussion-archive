import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getDiscussionUrl, getForumName, getForumUrl } from "@/lib/luogu";
import stringifyTime from "@/lib/time";
import UserInfo from "@/components/UserInfo";
import "@/components/markdown.css";
import serializeReply from "@/lib/serialize-reply";
import Reply from "@/components/replies/Reply";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) notFound();
  const snapshot = await prisma.snapshot.findFirst({
    select: { title: true, discussion: { select: { takedown: true } } },
    orderBy: { time: "desc" },
    where: { discussionId: id },
  });
  return {
    title: `${
      snapshot && !snapshot.discussion.takedown
        ? `「${snapshot.title}」`
        : "404"
    } - 洛谷帖子保存站`,
  };
}

export default async function Page({
  children,
  params,
}: React.PropsWithChildren<{ params: { id: string } }>) {
  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) notFound();
  const {
    replyCount,
    time,
    snapshots: [{ title, forum, author, content, until: updatedAt }],
    _count: { replies },
    takedown,
  } = (await prisma.discussion.findUnique({
    where: { id },
    select: {
      time: true,
      replyCount: true,
      snapshots: {
        select: {
          until: true,
          title: true,
          forum: true,
          author: true,
          content: true,
        },
        orderBy: { time: "desc" },
        take: 1,
      },
      takedown: { select: { reason: true, submitter: true } },
      _count: { select: { replies: true } },
    },
  })) ?? notFound();

  if (takedown)
    return (
      <>
        <p>{takedown.reason}</p>
        <p>
          由 <UserInfo user={takedown.submitter} /> 申请删除。
        </p>
      </>
    );

  return (
    <div className="row px-2 px-md-0">
      <div className="col-lg-4 col-md-5 col-12 order-md-last mb-4s">
        <div className="rounded-4 shadow-bssb px-4 py-3">
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
              <span className="fw-semibold">当前回复</span>
              <span className="text-muted">{replyCount}</span>
            </li>
            <li className="d-flex justify-content-between lh-lg">
              <span className="fw-semibold">已保存回复</span>
              <span className="text-muted">{replies}</span>
            </li>
            <li className="d-flex justify-content-between lh-lg">
              <span className="fw-semibold">发布时间</span>
              <span className="text-muted">{stringifyTime(time)}</span>
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
              className="btn btn-outline-secondary shadow-bssb-sm"
              href={getDiscussionUrl(parseInt(params.id, 10))}
              target="_blank"
              rel="noopener noreferrer"
            >
              查看原帖
            </a>
          </div>
        </div>
      </div>
      <div className="col-lg-8 col-md-7 col-12">
        <div className="bg-body rounded-4 shadow-bssb mb-4s px-4 py-3 fs-2 fw-semibold d-none d-md-block">
          {title}
        </div>
        <Reply
          discussion={{ id, authorId: author.id }}
          reply={{
            author,
            ...(await serializeReply(id, { content, time })),
          }}
        />
        {children}
      </div>
    </div>
  );
}
