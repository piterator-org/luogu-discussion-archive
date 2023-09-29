import { Prisma } from "@prisma/client";

export const selectUser = {
  withIdOnly: Prisma.validator<Prisma.UserDefaultArgs>()({
    select: {
      id: true,
    },
  }).select,
  withLatest: Prisma.validator<Prisma.UserDefaultArgs>()({
    select: {
      id: true,
      userSnapshots: {
        orderBy: { time: "desc" },
        take: 1,
      },
    },
  }).select,
};

export const selectUserWithLatest = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: selectUser.withLatest,
});

export type LatestUser = Prisma.UserGetPayload<typeof selectUserWithLatest>;
