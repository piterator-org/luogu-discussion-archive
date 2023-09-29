import UserAvatar from "@/components/UserAvatar";
import UserInfo from "@/components/UserInfo";
import type { LatestUser } from "@/lib/user";

export default function Ostracon({
  ostracon,
}: {
  ostracon: {
    time: Date;
    user: LatestUser;
    content: string;
  };
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
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: ostracon.content }} />
          <span className="text-body-tertiary">
            {/* TODO: icon font instead of svg */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              fill="currentColor"
              className="bi bi-arrow-return-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5z"
              />
            </svg>{" "}
            <UserInfo user={ostracon.user} />
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
