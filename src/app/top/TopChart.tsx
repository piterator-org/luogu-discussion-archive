import { getUserUrl, getUserAvatarUrl } from "@/lib/luogu";
import stringifyTime from "@/lib/time";
import type { User } from "@prisma/client";
import UserInfo from "@/components/UserInfo";
import Image from "next/image";
import Link from "next/link";

export default function TopChart({
  discussions,
}: {
  discussions: {
    id: number;
    author: User;
    title: string;
    time: Date;
    replyCount: number;
  }[];
}) {
  return (
    <>
      {discussions.map((discussion) => (
        <div className="reply position-relative">
          <a
            href={getUserUrl(discussion.author.id)}
            className="reply-avatar"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={getUserAvatarUrl(discussion.author.id)}
              className="rounded-circle shadow"
              fill
              alt={discussion.author.id.toString()}
            />
          </a>
          <div className="reply-card bg-white rounded-4 shadow mb-4s">
            <div className="reply-meta bg-light rounded-top-4 pe-4 py-2">
              {/* <span className="font-monospace align-top text-body-tertiary me-1">@</span> */}
              <UserInfo user={discussion.author} />
            </div>
            <div className="reply-content pe-4 py-3">
              <Link
                className="text-decoration-none fw-semibold"
                href={`/${discussion.id}`}
              >
                {discussion.title}
              </Link>
              <span
                className="text-end text-body-tertiary d-block"
                style={{ fontSize: ".8rem" }}
              >
                {discussion.replyCount} 楼 <br />
                {stringifyTime(discussion.time)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
