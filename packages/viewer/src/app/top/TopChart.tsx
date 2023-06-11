import stringifyTime from "@/lib/time";
import type { User } from "@prisma/client";
import UserAvatar from "@/components/UserAvatar";
import UserInfo from "@/components/UserInfo";
import Link from "next/link";

export default function TopChart({
  discussions,
}: {
  discussions: {
    id: number;
    time: Date;
    replyCount: number;
    snapshots: {
      time: Date;
      title: string;
      author: User;
      forum: string;
      content: string;
    }[];
  }[];
}) {
  return (
    <>
      {discussions.map((discussion) => (
        <div className="entry position-relative" key={discussion.id}>
          <UserAvatar
            className="entry-avatar"
            user={discussion.snapshots[0].author}
          />
          <div className="entry-card bg-white rounded-4 shadow mb-4s">
            <div className="entry-meta bg-light rounded-top-4 pe-4 py-2 overflow-ellipsis">
              <UserInfo user={discussion.snapshots[0].author} />
            </div>
            <div className="entry-content pe-4 py-3">
              <Link
                className="text-decoration-none fw-semibold d-inline-block"
                href={`/${discussion.id}`}
              >
                {discussion.snapshots[0].title}
              </Link>
              <div
                className="text-body-tertiary mt-1"
                style={{ fontSize: ".8rem" }}
              >
                {discussion.replyCount} 层
                <span className="float-end">
                  {stringifyTime(discussion.time)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
