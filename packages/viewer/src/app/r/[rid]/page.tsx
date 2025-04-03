import "@/components/markdown.css";
import { notFound, redirect } from "next/navigation";
import { checkExists } from "@/lib/utils";
import Link from "next/link";
import prisma from "@/lib/prisma";
import Content from "@/components/replies/Content";
import UserInfo from "@/components/UserInfo";
import UserAvatar from "@/components/UserAvatar";
import stringifyTime from "@/lib/time";
import getReplyRaw from "./get-reply-raw";
import savedInLegacyList from "../saved-in-legacy.json";

export const metadata = { title: "金玉良言 - 洛谷帖子保存站" };

const REPLIES_PER_PAGE = parseInt(process.env.REPLIES_PER_PAGE ?? "10", 10);

export default async function Page({ params }: { params: { rid: string } }) {
  const id = parseInt(params.rid, 10);
  if (Number.isNaN(id)) notFound();
  const reply = await getReplyRaw(id);
  if (!reply) {
    if (checkExists(savedInLegacyList, id))
      redirect(`https://legacy.lglg.top/r/${id}`);
    else notFound();
  }
  const pages = Math.ceil(
    (await prisma.reply.count({
      where: { id: { lte: id }, postId: reply.post.id },
    })) / REPLIES_PER_PAGE,
  );

  if (reply.post.takedown) {
    return (
      <>
        <p>{reply.post.takedown.reason}</p>
        <p>
          由于回复的帖子由 <UserInfo user={reply.post.takedown.submitter} />{" "}
          申请删除，本回复无法查看。
        </p>
      </>
    );
  }

  if (reply.takedown) {
    return (
      <>
        <p>{reply.takedown.reason}</p>
        <p>
          由 <UserInfo user={reply.takedown.submitter} /> 申请删除。
        </p>
      </>
    );
  }

  return (
    <div className="row px-2 px-md-0">
      <div className="col-xl-9 col-lg-10 col-md-11 col-12 mt-3 mb-3x mx-auto">
        <div className="pb-3 mb-4x position-relative">
          <div className="rounded-4 shadow-bssb">
            <div className="px-md-4x px-4 pt-md-3x pt-2x pb-md-4x pb-4 position-relative">
              <Content
                postAuthor={reply.post.snapshots[0].author.id}
                content={reply.snapshots[0].content}
              />
              <span
                className="text-end text-body-tertiary d-block d-md-none"
                style={{ fontSize: ".8rem" }}
              >
                {stringifyTime(reply.time)}
              </span>
            </div>
          </div>
          <div
            className="position-absolute"
            style={{ bottom: "-1.6em", left: ".8em" }}
          >
            <UserAvatar user={reply.snapshots[0].author} size={72} />
          </div>
          <div
            className="ps-6 position-absolute reply-meta-bottom"
            style={{ left: 0, right: 0 }}
          >
            <div>
              <UserInfo user={reply.snapshots[0].author} />
              {reply.snapshots[0].author.id ===
              reply.post.snapshots[0].author.id ? (
                <span
                  className="ms-1 badge position-relative bg-teal d-inline-block"
                  style={{ top: "-.15em", left: ".08em", marginRight: ".08em" }}
                >
                  楼主
                </span>
              ) : (
                ""
              )}
              <span
                className="float-end text-body-tertiary d-none d-md-inline"
                style={{ marginRight: ".8em" }}
              >
                {stringifyTime(reply.time)}
              </span>
            </div>
            <div className="fw-medium text-body-tertiary d-none d-md-block">
              于帖子{" "}
              <Link
                className="text-decoration-none"
                href={`/${reply.post.id}/${pages}#${params.rid}`}
              >
                {reply.post.snapshots[0].title}
                <span className="fw-normal">（第 {pages} 页）</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-5 rounded-4 shadow-bssb d-md-none px-4 py-3">
          <div className="fw-medium text-body-tertiary">
            于帖子{" "}
            <Link
              className="text-decoration-none"
              href={`/${reply.post.id}/${pages}#${params.rid}`}
            >
              {reply.post.snapshots[0].title}
              <span className="fw-normal">（第 {pages} 页）</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
