import { Prisma, PrismaClient, UserSnapshot } from "@prisma/client";
import { UserSummary } from "./user";

export const upsertUserSnapshotHook = async (
  tx: PrismaClient | Prisma.TransactionClient,
  user: UserSummary
) => {
  const lastSnapshot = await tx.userSnapshot.findFirst({
    where: { userId: user.uid },
    orderBy: { time: "desc" },
  });
  if (
    lastSnapshot !== null &&
    user.slogan === lastSnapshot.slogan &&
    user.ccfLevel === lastSnapshot.ccfLevel &&
    user.badge === lastSnapshot.badge &&
    user.isAdmin === lastSnapshot.isAdmin &&
    user.isBanned === lastSnapshot.isBanned &&
    (user.isRoot ?? null) === lastSnapshot.isRoot &&
    user.color === lastSnapshot.color &&
    user.name === lastSnapshot.name &&
    user.slogan === lastSnapshot.slogan &&
    (user.background ?? "") === lastSnapshot.background
  ) {
    return await tx.userSnapshot.update({
      where: {
        userId_time: { userId: lastSnapshot.userId, time: lastSnapshot.time },
      },
      data: { until: new Date() },
    });
  }
  const userSnapshot = { ...user, uid: undefined };
  return await tx.userSnapshot.create({
    data: {
      ...userSnapshot,
      background: user.background ?? "",
      user: {
        connectOrCreate: {
          where: { id: user.uid },
          create: { id: user.uid },
        },
      },
    },
  });
};
