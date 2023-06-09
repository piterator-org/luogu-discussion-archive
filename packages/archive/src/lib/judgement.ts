import type { PrismaClient, PrismaPromise } from "@prisma/client";
import type { BaseLogger } from "pino";
import { parseApp, parseComment, parseUser } from "./parser";

export default async function saveJudgements(
  logger: BaseLogger,
  prisma: PrismaClient
) {
  const operations: PrismaPromise<unknown>[] = [];

  (await parseApp(logger, "https://www.luogu.com.cn/judgement"))
    .querySelectorAll("li.feed-li > div.am-comment-main")
    .forEach((element) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const user = parseUser(element.querySelector(".feed-username")!);
      operations.push(
        prisma.user.upsert({
          where: { id: user.id },
          create: user,
          update: user,
        })
      );

      const judgement = { userId: user.id, ...parseComment(element) };
      operations.push(
        prisma.judgement.upsert({
          where: { time_userId: { time: judgement.time, userId: user.id } },
          create: judgement,
          update: judgement,
        })
      );
    });

  await prisma.$transaction(operations);
}
