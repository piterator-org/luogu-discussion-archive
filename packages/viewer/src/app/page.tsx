import prisma from "@/lib/prisma";
import { getUserUrl, getUserAvatarUrl } from "@/lib/luogu";
import stringifyTime from "@/lib/time";
import UserInfo from "@/components/UserInfo";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

const NUM_DISCUSSIONS_HOME_PAGE = parseInt(
  process.env.NUM_DISCUSSIONS_HOME_PAGE ?? "16",
  10
);
const NUM_WATER_TANKS_HOME_PAGE = parseInt(
  process.env.NUM_DISCUSSIONS_HOME_PAGE ?? "30",
  10
);
const LIMIT_MILLISECONDS_HOT_DISCUSSION = parseInt(
  process.env.NUM_DISCUSSIONS_HOME_PAGE ?? "15552000000",
  10
);
const RANGE_MILLISECONDS_WATER_TANK = parseInt(
  process.env.RANGE_MILLISECONDS_WATER_TANK ?? "2592000000",
  10
);

export default async function Page() {
  const discussions = await prisma.discussion.findMany({
    where: {
      time: {
        gte: new Date(new Date().getTime() - LIMIT_MILLISECONDS_HOT_DISCUSSION),
      },
    },
    select: {
      id: true,
      time: true,
      replyCount: true,
      snapshots: {
        select: {
          time: true,
          title: true,
          forum: true,
          author: true,
          content: true,
        },
        orderBy: { time: "desc" },
        take: 1,
      },
    },
    orderBy: { replyCount: "desc" },
    take: NUM_DISCUSSIONS_HOME_PAGE,
  });

  const waterTanks = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          replies: true,
        },
      },
    },
    orderBy: {
      replies: {
        _count: "desc",
      },
    },
    take: NUM_WATER_TANKS_HOME_PAGE,
  });

  return (
    <>
      <div className="mt-6s px-3 px-md-0 mb-5s">
        <div
          className="input-group input-group-lg mx-auto"
          style={{ maxWidth: "40em" }}
        >
          <input
            className="form-control shadow"
            autoComplete="off"
            placeholder="帖子关键词、发布者"
            disabled
          />
          <button className="btn btn-primary shadow" type="button" disabled>
            即将上线
          </button>
        </div>
      </div>
      <div className="px-2 px-md-0 py-5">
        <div className="row">
          <div className="col-12 col-md-8 col-xl-9">
            <div className="rounded-4 shadow mb-4s px-3x pt-3x">
              <div className="row">
                {discussions.map((discussion) => (
                  <div className="col-12 col-lg-6">
                    <div className="reply position-relative">
                      <a
                        href={getUserUrl(discussion.snapshots[0].author.id)}
                        className="reply-avatar"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={getUserAvatarUrl(
                            discussion.snapshots[0].author.id
                          )}
                          className="rounded-circle shadow-sm"
                          fill
                          alt={discussion.snapshots[0].author.id.toString()}
                        />
                      </a>
                      <div className="reply-card bg-white rounded-4 shadow-sm mb-3x">
                        <div className="reply-meta bg-light rounded-top-4 pe-4 py-2 overflow-ellipsis">
                          <UserInfo user={discussion.snapshots[0].author} />
                        </div>
                        <div className="reply-content pe-4 py-3">
                          <Link
                            className="text-decoration-none fw-semibold d-inline-block overflow-ellipsis"
                            href={`/${discussion.id}`}
                          >
                            {discussion.snapshots[0].title}
                          </Link>
                          <div
                            className="text-body-tertiary"
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
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 col-xl-3">
            <div className="rounded-4 shadow px-4 px-md-3x pt-3x pb-2x">
              <div className="mb-2 fs-4 fw-semibold">龙王榜（30 天）</div>
              <ul className="list-group">
                {waterTanks.map((user) => (
                  <li className="d-flex justify-content-between lh-lg">
                    <span
                      className="overflow-ellipsis"
                      style={{ maxWidth: "calc(100% - 4.5em)" }}
                    >
                      <UserInfo user={user} />
                    </span>
                    {/* eslint-disable-next-line no-underscore-dangle */}
                    <span>{user._count.replies} 层</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
