import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getPostUrl, getForumUrl } from "@/lib/luogu";
import stringifyTime from "@/lib/time";
import UserInfo from "@/components/UserInfo";
import "@/components/markdown.css";
import UpdateButton from "@/components/UpdateButton";
import Reply from "@/components/replies/Reply";
import { selectPost } from "@/lib/post";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) notFound();
  const snapshot = await prisma.postSnapshot.findFirst({
    select: { title: true, post: { select: { takedown: true } } },
    orderBy: { time: "desc" },
    where: { postId: id },
  });
  return {
    title: `${
      snapshot && !snapshot.post.takedown ? `「${snapshot.title}」` : "404"
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
  } = (await prisma.post.findUnique({
    where: { id },
    select: {
      ...selectPost.withBasic,
      ...selectPost.withLatestContent,
      ...selectPost.withTakedown,
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
                {forum.name}
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
              href={getPostUrl(parseInt(params.id, 10))}
              target="_blank"
              rel="noopener noreferrer"
            >
              查看原帖
            </a>
            <UpdateButton className="ms-2" target={params.id} key={params.id}>
              更新帖子
            </UpdateButton>
          </div>
        </div>
      </div>
      <div className="col-lg-8 col-md-7 col-12">
        <div className="bg-body rounded-4 shadow-bssb mb-4s px-4 py-3 fs-2 fw-semibold d-none d-md-block">
          {title}
        </div>
        <Reply
          post={{ id, authorId: author.id }}
          reply={{
            time,
            id: -1,
            postId: id,
            snapshots: [{ content, time, author }],
          }}
        />
        {children}
      </div>
    </div>
  );
}
