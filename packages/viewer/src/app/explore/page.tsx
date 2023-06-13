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
                    <div className="entry position-relative">
                      <UserAvatar
                        className="entry-avatar"
                        decoratorShadow="sm"
                        user={discussion.snapshots[0].author}
                      />
                      <div className="entry-card bg-white rounded-4 shadow-sm mb-3x">
                        <div className="entry-meta bg-light rounded-top-4 pe-4 py-2 overflow-ellipsis">
                          <UserInfo user={discussion.snapshots[0].author} />
                        </div>
                        <div className="entry-content pe-4 py-3">
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              className="bi bi-calendar4-week ms-2"
                              viewBox="0 0 16 16"
                              style={{ position: "relative", top: "-.1125em" }}
                            >
                              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z" />
                              <path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-2 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                            </svg>{" "}
                            {discussion.recentReplyCount}
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
