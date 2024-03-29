import UserAvatar from "@/components/UserAvatar";
import UserInfo from "@/components/UserInfo";
import type { LatestUser } from "@/lib/user";
import { ReactNode } from "react";
import { BsArrowReturnRight } from "react-icons/bs";

export default function Ostracon({
  ostracon,
  children,
}: {
  ostracon: {
    time: Date;
    user: LatestUser;
  };
  children: ReactNode;
}) {
  return (
    <div className="position-relative">
      <div className="rounded-4 shadow-bssb mb-4s">
        <div className="bg-light-bssb rounded-top-4 px-4 py-2">
          <span className="text-body-tertiary">
            {ostracon.time.toLocaleString("zh")}
          </span>
        </div>
        <div className="px-4 py-3">
          <div>{children}</div>
          <span className="text-body-tertiary">
            <BsArrowReturnRight /> <UserInfo user={ostracon.user} />
          </span>
          <UserAvatar
            className="ostracon-avatar d-none d-md-block"
            user={ostracon.user}
          />
        </div>
      </div>
    </div>
  );
}
