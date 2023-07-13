import prisma from "@/lib/prisma";
import UserInfo from "@/components/UserInfo";

const NUM_WATER_TANKS_HOME_PAGE = parseInt(
  process.env.NUM_DISCUSSIONS_HOME_PAGE ?? "100",
  10,
);
const RANGE_MILLISECONDS_WATER_TANK = parseInt(
  process.env.RANGE_MILLISECONDS_WATER_TANK ?? "2592000000",
  10,
);

export default async function Users() {
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
    ).map((u) => [u.id, u]),
  );
  return (
    <ul className="list-group">
      {userReplyCount
        .map((r) => ({
          count: r._count,
          user: users[r.authorId],
        }))
        .map((tank, i) => (
          <li
            className="d-flex justify-content-between lh-lg"
            key={tank.user.id}
          >
            <span
              className="text-body-tertiary overflow-ellipsis"
              style={{ maxWidth: "calc(100% - 4.5em)" }}
            >
              <span className="d-inline-block" style={{ width: "2em" }}>
                {i + 1}
              </span>
              <UserInfo user={tank.user} />
            </span>
            <span className="text-body-secondary">{tank.count} 层</span>
          </li>
        ))}
    </ul>
  );
}
