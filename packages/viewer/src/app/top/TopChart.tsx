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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  className="bi bi-chat-dots"
                  viewBox="0 0 16 16"
                  style={{ position: "relative", top: "-.1125em" }}
                >
                  <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                  <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z" />
                </svg>{" "}
                {discussion.replyCount}
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
