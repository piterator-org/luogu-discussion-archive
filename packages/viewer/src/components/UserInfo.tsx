import "./luogu3.css";
import Link from "next/link";
import {
  getCheckmarkColor,
  getNameClassByColor,
  getUserUrl,
} from "@/lib/luogu";
import { LatestUser } from "@/lib/user";

export default function UserInfo({
  user,
  snapshotId,
  href,
  noHref,
}: {
  user: LatestUser;
  // eslint-disable-next-line react/require-default-props
  snapshotId?: number;
  // eslint-disable-next-line react/require-default-props
  href?: string;
  // eslint-disable-next-line react/require-default-props
  noHref?: boolean;
}) {
  const snapshot = user.userSnapshots[snapshotId ?? 0];
  return (
    <span className="text-nowrap">
      {/* eslint-disable-next-line no-nested-ternary */}
      {noHref ? (
        <span
          className={`text-decoration-none lg-fg-${getNameClassByColor(
            snapshot.color,
          )}`}
        >
          {snapshot.name}
        </span>
      ) : href === undefined ? (
        <Link
          href={getUserUrl(user.id)}
          className={`text-decoration-none lg-fg-${getNameClassByColor(
            snapshot.color,
          )}`}
        >
          {snapshot.name}
        </Link>
      ) : (
        <a
          href={href}
          className={`text-decoration-none lg-fg-${getNameClassByColor(
            snapshot.color,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {snapshot.name}
        </a>
      )}
      {snapshot.ccfLevel >= 3 && (
        <svg
          className="ms-1 position-relative"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          fill={getCheckmarkColor(snapshot.ccfLevel)}
          style={{ top: "-.1em", left: "-.02em" }}
        >
          <path d="M16 8C16 6.84375 15.25 5.84375 14.1875 5.4375C14.6562 4.4375 14.4688 3.1875 13.6562 2.34375C12.8125 1.53125 11.5625 1.34375 10.5625 1.8125C10.1562 0.75 9.15625 0 8 0C6.8125 0 5.8125 0.75 5.40625 1.8125C4.40625 1.34375 3.15625 1.53125 2.34375 2.34375C1.5 3.1875 1.3125 4.4375 1.78125 5.4375C0.71875 5.84375 0 6.84375 0 8C0 9.1875 0.71875 10.1875 1.78125 10.5938C1.3125 11.5938 1.5 12.8438 2.34375 13.6562C3.15625 14.5 4.40625 14.6875 5.40625 14.2188C5.8125 15.2812 6.8125 16 8 16C9.15625 16 10.1562 15.2812 10.5625 14.2188C11.5938 14.6875 12.8125 14.5 13.6562 13.6562C14.4688 12.8438 14.6562 11.5938 14.1875 10.5938C15.25 10.1875 16 9.1875 16 8ZM11.4688 6.625L7.375 10.6875C7.21875 10.8438 7 10.8125 6.875 10.6875L4.5 8.3125C4.375 8.1875 4.375 7.96875 4.5 7.8125L5.3125 7C5.46875 6.875 5.6875 6.875 5.8125 7.03125L7.125 8.34375L10.1562 5.34375C10.3125 5.1875 10.5312 5.1875 10.6562 5.34375L11.4688 6.15625C11.5938 6.28125 11.5938 6.5 11.4688 6.625Z" />
        </svg>
      )}
      {snapshot.badge && (
        <span
          className={`ms-1 badge position-relative lg-bg-${getNameClassByColor(
            snapshot.color,
          )} d-inline-block`}
          style={{ top: "-.15em", left: ".08em", marginRight: ".08em" }}
        >
          {snapshot.badge}
        </span>
      )}
    </span>
  );
}
