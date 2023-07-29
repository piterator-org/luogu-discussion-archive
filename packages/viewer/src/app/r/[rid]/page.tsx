import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import "@/components/markdown.css";
import Content from "@/components/replies/Content";
import UserInfo from "@/components/UserInfo";
import UserAvatar from "@/components/UserAvatar";
import serializeReply from "@/lib/serialize-reply";
import getReplyRaw from "./get-reply-raw";

export const metadata = { title: "金玉良言 - 洛谷帖子保存站" };

const REPLIES_PER_PAGE = parseInt(process.env.REPLIES_PER_PAGE ?? "10", 10);

export default async function Page({ params }: { params: { rid: string } }) {
  const id = parseInt(params.rid, 10);
  if (Number.isNaN(id)) notFound();
  const replyRaw = await getReplyRaw(id);
  const reply = {
    ...replyRaw,
    ...(await serializeReply(replyRaw.discussion.id, replyRaw)),
  };
  const pages = Math.ceil(
    (await prisma.reply.count({
      where: { id: { lte: id }, discussionId: reply.discussion.id },
    })) / REPLIES_PER_PAGE,
  );
  // return redirect(`/${discussionId}/${pages}#${params.rid}`);
  return (
    <div className="row px-2 px-md-0">
      <div className="col-xl-9 col-lg-10 col-md-11 col-12 mt-3 mb-3x mx-auto">
        <div className="pb-3 mb-4x position-relative">
          <div className="bg-white rounded-4 shadow">
            <div className="px-md-4x px-4 pt-md-3x pt-2x pb-md-4x pb-4 position-relative">
              <Content
                discussionAuthor={reply.discussion.snapshots[0].authorId}
                content={reply.content}
                usersMetioned={reply.usersMetioned}
              />
              <span
                className="text-end text-body-tertiary d-block d-md-none"
                style={{ fontSize: ".8rem" }}
              >
                {reply.time}
              </span>
            </div>
          </div>
          <div
            className="position-absolute"
            style={{ bottom: "-1.6em", left: ".8em" }}
          >
            <UserAvatar user={reply.author} size={72} />
          </div>
          <div
            className="ps-6 position-absolute reply-meta-bottom"
            style={{ left: 0, right: 0 }}
          >
            <div>
              <UserInfo user={reply.author} />
              <span
                className="float-end text-body-tertiary d-none d-md-inline"
                style={{ marginRight: ".8em" }}
              >
                {reply.time}
              </span>
            </div>
            <div className="fw-medium text-body-tertiary d-none d-md-block">
              于帖子{" "}
              <Link
                className="text-decoration-none"
                href={`/${reply.discussion.id}/${pages}#${params.rid}`}
              >
                {reply.discussion.snapshots[0].title}
                <span className="fw-normal">（第 {pages} 页）</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-5 bg-white rounded-4 shadow d-md-none px-4 py-3">
          <div className="fw-medium text-body-tertiary">
            于帖子{" "}
            <Link
              className="text-decoration-none"
              href={`/${reply.discussion.id}/${pages}#${params.rid}`}
            >
              {reply.discussion.snapshots[0].title}
              <span className="fw-normal">（第 {pages} 页）</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
