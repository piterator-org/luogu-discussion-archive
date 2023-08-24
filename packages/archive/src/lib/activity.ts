// 不要学洛谷的狗屎英文，feed 是“订阅源”的意思，不是源中的一条消息。

import type { BaseLogger } from "pino";
import type { PrismaClient, PrismaPromise } from "@prisma/client";
import { getResponse } from "./parser";
import { upsertUser, type UserSummary } from "./user";

export interface Activity {
  content: string;
  id: number;
  type: number;
  time: number;
  user: UserSummary;
}

interface Body {
  feeds: {
    result: Activity[];
    perPage: number;
    count: number;
  };
}

export default async function saveActivities(
  logger: BaseLogger,
  prisma: PrismaClient,
  page = 1,
  operations: Array<PrismaPromise<unknown>> = [],
) {
  const res = await getResponse(
    logger,
    `https://www.luogu.com.cn/api/feed/list?page=${page}`,
    false,
  ).then((response): Promise<Body> => response.json());
  res.feeds.result.forEach((activity) => {
    const data = {
      ...activity,
      time: new Date(activity.time * 1000),
      user: undefined,
      userId: activity.user.uid,
    };
    operations.push(
      upsertUser(prisma, activity.user),
      prisma.activity.upsert({
        where: { id: activity.id },
        create: data,
        update: data,
      }),
    );
  });
  const last = await prisma.activity.findFirst({ orderBy: { id: "desc" } });
  if (
    res.feeds.result.length !== res.feeds.perPage ||
    (last && res.feeds.result[res.feeds.result.length - 1].id <= last.id)
  )
    return prisma.$transaction(operations);
  return saveActivities(logger, prisma, page + 1, operations);
}
