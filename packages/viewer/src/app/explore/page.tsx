import prisma from "@/lib/prisma";
import stringifyTime from "@/lib/time";
import UserAvatar from "@/components/UserAvatar";
import UserInfo from "@/components/UserInfo";
import Link from "next/link";

export const dynamic = "force-dynamic";

const NUM_DISCUSSIONS_HOME_PAGE = parseInt(
  process.env.NUM_DISCUSSIONS_HOME_PAGE ?? "20",
  10
);
const NUM_WATER_TANKS_HOME_PAGE = parseInt(
  process.env.NUM_DISCUSSIONS_HOME_PAGE ?? "30",
  10
);
const LIMIT_MILLISECONDS_HOT_DISCUSSION = parseInt(
  process.env.NUM_DISCUSSIONS_HOME_PAGE ?? "604800000",
  10
);
const RANGE_MILLISECONDS_WATER_TANK = parseInt(
  process.env.RANGE_MILLISECONDS_WATER_TANK ?? "2592000000",
  10
);

export const metadata = { title: "发现 - 洛谷帖子保存站" };

async function getDiscussions() {
  const discussionReplyCount = await prisma.reply.groupBy({
    by: ["discussionId"],
    where: {
      time: {
        gte: new Date(new Date().getTime() - LIMIT_MILLISECONDS_HOT_DISCUSSION),
      },
    },
    _count: true,
    orderBy: { _count: { id: "desc" } },
    take: NUM_DISCUSSIONS_HOME_PAGE,
  });
  const discussions = Object.fromEntries(
    (
      await prisma.discussion.findMany({
        where: { id: { in: discussionReplyCount.map((r) => r.discussionId) } },
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
      })
    ).map((d) => [d.id, d])
  );
  return discussionReplyCount.map((r) => ({
    ...discussions[r.discussionId],
    recentReplyCount: r._count,
  }));
}

async function getUsers() {
  const userReplyCount = await prisma.reply.groupBy({
    by: ["authorId"],
    where: {
      time: {
        gte: new Date(new Date().getTime() - RANGE_MILLISECONDS_WATER_TANK),
      },
    },
    _count: true,
    orderBy: { _count: { id: "desc" } },
    take: NUM_WATER_TANKS_HOME_PAGE,
  });
  const users = Object.fromEntries(
    (
      await prisma.user.findMany({
        where: { id: { in: userReplyCount.map((r) => r.authorId) } },
      })
    ).map((u) => [u.id, u])
  );
  return userReplyCount.map((r) => ({
    count: r._count,
    user: users[r.authorId],
  }));
}

export default async function Page() {
  const [discussions, users] = await Promise.all([
    getDiscussions(),
    getUsers(),
  ]);
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
                  <div className="col-12 col-lg-6" key={discussion.id}>
                    <div className="reply position-relative">
                      <UserAvatar
                        className="reply-avatar"
                        decoratorShadow="sm"
                        user={discussion.snapshots[0].author}
                      />
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
                            本周 {discussion.recentReplyCount} 层（共{" "}
                            {discussion.replyCount} 层）
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
                {users.map((tank, i) => (
                  <li
                    className="d-flex justify-content-between lh-lg"
                    key={tank.user.id}
                  >
                    <span
                      className="overflow-ellipsis"
                      style={{ maxWidth: "calc(100% - 4.5em)" }}
                    >
                      <span
                        className="text-body-tertiary d-inline-block"
                        style={{ width: "1.75em" }}
                      >
                        {i + 1}
                      </span>
                      <UserInfo user={tank.user} />
                    </span>
                    <span className="text-body-secondary">{tank.count} 层</span>
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
