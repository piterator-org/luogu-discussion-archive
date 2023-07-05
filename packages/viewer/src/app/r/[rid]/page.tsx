import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Content from "@/components/replies/Content";
import UserInfo from "@/components/UserInfo";
import serializeReply from "@/lib/serialize-reply";
import { getUserAvatarUrl, getUserUrl } from "@/lib/luogu";

const REPLIES_PER_PAGE = parseInt(process.env.REPLIES_PER_PAGE ?? "10", 10);

export default async function Page({ params }: { params: { rid: string } }) {
  const id = parseInt(params.rid, 10);
  if (Number.isNaN(id)) notFound();
  const replyRaw =
    (await prisma.reply.findUnique({
      select: {
        id: true,
        author: true,
        time: true,
        content: true,
        discussion: {
          select: {
            id: true,
            snapshots: {
              select: { title: true, authorId: true },
              orderBy: { time: "desc" },
              take: 1,
            },
          },
        },
      },
      where: { id },
    })) ?? notFound();
  const reply = {
    ...replyRaw,
    ...(await serializeReply(replyRaw.discussion.id, replyRaw)),
  };
  const pages = Math.ceil(
    (await prisma.reply.count({
      where: { id: { lte: id }, discussionId: reply.discussion.id },
    })) / REPLIES_PER_PAGE
  );
  // return redirect(`/${discussionId}/${pages}#${params.rid}`);
  return (
    <div className="row px-2 px-md-0">
      <div className="col-xl-9 col-lg-10 col-md-11 col-12 mt-3 mb-3x mx-auto">
        <div className="pb-3 mb-4x position-relative">
          <div className="bg-white rounded-4 shadow">
            <div className="px-4 pt-2 pb-4 position-relative">
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
            <a
              href={getUserUrl(reply.author.id)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={getUserAvatarUrl(reply.author.id)}
                className="rounded-circle shadow"
                width={72}
                height={72}
                alt={reply.author.id.toString()}
              />
            </a>
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
