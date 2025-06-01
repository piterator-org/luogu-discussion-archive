import type { Color, PrismaClient } from "@prisma/client";

export interface UserSummary {
  uid: number;
  name: string;
  badge: string | null;
  isAdmin: boolean;
  isBanned: boolean;
  color: Color;
  ccfLevel: number;
  isRoot?: true;
  xcpcLevel?: number;
}

export const upsertUserSnapshot = async (
  prisma: PrismaClient,
  user: UserSummary,
) => {
  await prisma.$transaction(async (tx) => {
    const lastSnapshot = await tx.userSnapshot.findFirst({
      where: { userId: user.uid },
      orderBy: { time: "desc" },
    });
    if (
      lastSnapshot !== null &&
      user.ccfLevel === lastSnapshot.ccfLevel &&
      user.badge === lastSnapshot.badge &&
      user.isAdmin === lastSnapshot.isAdmin &&
      user.isBanned === lastSnapshot.isBanned &&
      (user.isRoot ?? null) === lastSnapshot.isRoot &&
      user.color === lastSnapshot.color &&
      user.name === lastSnapshot.name
    ) {
      await tx.userSnapshot.update({
        where: {
          userId_time: { userId: lastSnapshot.userId, time: lastSnapshot.time },
        },
        data: { until: new Date() },
      });
      return;
    }
    const userSnapshot = {
      ...user,
      uid: undefined,
      background: undefined,
      slogan: undefined,
      avatar: undefined,
      // TODO: 这里以后加上
      xcpcLevel: undefined,
    };
    await tx.userSnapshot.create({
      data: {
        ...userSnapshot,
        user: {
          connectOrCreate: {
            where: { id: user.uid },
            create: { id: user.uid },
          },
        },
      },
    });
  });
};
