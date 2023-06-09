import type { PrismaPromise } from "@prisma/client";
import { parseApp, parseComment, parseUser } from "./parser";
import prisma from "./prisma";

export default async function saveJudgements() {
  const operations: PrismaPromise<unknown>[] = [];

  (await parseApp("https://www.luogu.com.cn/judgement"))
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
