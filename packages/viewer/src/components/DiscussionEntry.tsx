import Link from "next/link";
import type { Discussion } from "@/lib/discussion";
import { ReactNode } from "react";
import UserAvatar from "./UserAvatar";
import UserInfo from "./UserInfo";

export default function DiscussionEntry({
  discussion,
  decoratorShadow,
  decoratorBreakpoint,
  ellipsis,
  metaBottom,
  children,
}: React.PropsWithChildren<{
  discussion: Discussion;
  // eslint-disable-next-line react/require-default-props
  decoratorShadow?: string;
  decoratorBreakpoint?: string;
  ellipsis?: boolean;
  metaBottom: ReactNode;
}>) {
  return (
    <div>
      <div
        className={`entry${
          decoratorBreakpoint !== undefined ? `-${decoratorBreakpoint}` : ""
        } position-relative`}
        key={discussion.id}
      >
        <UserAvatar
          className={`entry${
            decoratorBreakpoint !== undefined ? `-${decoratorBreakpoint}` : ""
          }-avatar`}
          decoratorShadow={decoratorShadow}
          user={discussion.snapshots[0].author}
        />
        <div
          className={`entry${
            decoratorBreakpoint !== undefined ? `-${decoratorBreakpoint}` : ""
          }-card bg-white rounded-4 shadow${
            decoratorShadow ? `-${decoratorShadow}` : ""
          } mb-${decoratorShadow === "sm" ? "3x" : "4s"}`}
        >
          <div
            className={`entry${
              decoratorBreakpoint !== undefined ? `-${decoratorBreakpoint}` : ""
            }-meta bg-light rounded-top-4 pe-4 py-2 overflow-ellipsis`}
          >
            <UserInfo user={discussion.snapshots[0].author} />
          </div>
          <div
            className={`entry${
              decoratorBreakpoint !== undefined ? `-${decoratorBreakpoint}` : ""
            }-content pe-4 py-3`}
          >
            <Link
              className={`text-decoration-none fw-medium d-inline-block${
                ellipsis ? " overflow-ellipsis" : ""
              }`}
              href={`/${discussion.id}`}
            >
              {discussion.snapshots[0].title}
            </Link>
            {children}
            <div
              className={`text-body-tertiary${ellipsis ? "" : " mt-1"}`}
              style={{ fontSize: ".8rem" }}
            >
              {metaBottom}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
