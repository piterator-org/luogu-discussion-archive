import Link from "next/link";
import type { Discussion } from "@/lib/discussion";
import UserAvatar from "./UserAvatar";
import UserInfo from "./UserInfo";

export default function DiscussionEntry({
  discussion,
  decoratorShadow,
  ellipsis,
  children,
}: React.PropsWithChildren<{
  discussion: Discussion;
  // eslint-disable-next-line react/require-default-props
  decoratorShadow?: string;
  ellipsis?: boolean;
}>) {
  return (
    <div className="entry position-relative" key={discussion.id}>
      <UserAvatar
        className="entry-avatar"
        decoratorShadow={decoratorShadow}
        user={discussion.snapshots[0].author}
      />
      <div
        className={`entry-card bg-white rounded-4 shadow${
          decoratorShadow ? `-${decoratorShadow}` : ""
        } mb-${decoratorShadow === "sm" ? "3x" : "4s"}`}
      >
        <div className="entry-meta bg-light rounded-top-4 pe-4 py-2 overflow-ellipsis">
          <UserInfo user={discussion.snapshots[0].author} />
        </div>
        <div className="entry-content pe-4 py-3">
          <Link
            className={`text-decoration-none fw-semibold d-inline-block${
              ellipsis ? " overflow-ellipsis" : ""
            }`}
            href={`/${discussion.id}`}
          >
            {discussion.snapshots[0].title}
          </Link>
          <div
            className={`text-body-tertiary${ellipsis ? "" : " mt-1"}`}
            style={{ fontSize: ".8rem" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
