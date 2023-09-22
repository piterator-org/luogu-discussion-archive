import { PrismaPromise, UserSnapshot } from "@prisma/client";
import prisma from "./prisma";
import { UserSummary } from "./user";

const postUpsertUserSnapshot = (
  user: UserSummary,
  snapshot: UserSnapshot | null
) => {
  if (
    snapshot &&
    user.slogan === snapshot.slogan &&
    user.ccfLevel === snapshot.ccfLevel &&
    user.badge === snapshot.badge &&
    user.isAdmin === snapshot.isAdmin &&
    user.isBanned === snapshot.isBanned &&
    user.isRoot === snapshot.isRoot &&
    user.color === snapshot.color &&
    user.name === snapshot.name &&
    user.slogan === snapshot.slogan &&
    (user.background || "") === snapshot.background
  ) {
    return prisma.userSnapshot.update({
      where: { userId_time: { ...snapshot } },
      data: { until: new Date() },
    });
  }
  return prisma.userSnapshot.create({
    data: {
      ...user,
      userId: user.uid,
      background: user.background || "",
      time: new Date(),
    },
  });
};

export const upsertUserSnapshotHook = async (user: UserSummary) => {
  const lastSnapshot = await prisma.userSnapshot.findFirst({
    where: {
      userId: user.uid,
    },
    orderBy: {
      time: "desc",
    },
  });

  return postUpsertUserSnapshot(user, lastSnapshot);
};
