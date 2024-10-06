// 不要学洛谷的狗屎英文，feed 是“订阅源”的意思，不是源中的一条消息。

import type { BaseLogger } from "pino";
import type { PrismaClient, PrismaPromise } from "@prisma/client";
import { getResponse } from "./parser";
import type { UserSummary } from "./user";
import { upsertUserSnapshot } from "./user";
import lgUrl from "../utils/url";

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

export async function saveActivityPage(
  logger: BaseLogger,
  prisma: PrismaClient,
  page: number,
  operations: PrismaPromise<unknown>[],
) {
  const res = await getResponse(
    logger,
    lgUrl(`/api/feed/list?page=${page}`, false),
    false,
  ).then((response): Promise<Body> => response.json());

  // eslint-disable-next-line no-restricted-syntax
  for (const { user } of res.feeds.result) {
    // eslint-disable-next-line no-await-in-loop
    await upsertUserSnapshot(prisma, user);
  }

  res.feeds.result.forEach((activity) => {
    const data = {
      ...activity,
      content: activity.content.replace(/\0/g, ""),
      time: new Date(activity.time * 1000),
      user: undefined,
      userId: activity.user.uid,
    };
    operations.push(
      prisma.activity.upsert({
        where: { id: activity.id },
        create: data,
        update: data,
      }),
    );
  });
  return res;
}

export default async function saveActivities(
  logger: BaseLogger,
  prisma: PrismaClient,
) {
  let res: Body;
  let page = 0;
  const operations: PrismaPromise<unknown>[] = [];
  const last = await prisma.activity.findFirst({ orderBy: { id: "desc" } });
  do
    // eslint-disable-next-line no-plusplus, no-await-in-loop
    res = await saveActivityPage(logger, prisma, ++page, operations);
  while (
    res.feeds.result.length === res.feeds.perPage &&
    (!last || res.feeds.result[res.feeds.result.length - 1].id > last.id)
  );
  await prisma.$transaction(operations);
}
