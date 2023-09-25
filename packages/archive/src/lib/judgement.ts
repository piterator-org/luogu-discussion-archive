import type { PrismaClient, PrismaPromise } from "@prisma/client";
import type { BaseLogger } from "pino";
import {
  JudgementProfile,
  getResponse,
  parseApp,
  parseComment,
  parseUser,
} from "./parser";
import { UserSummary, upsertUserSnapshotHook } from "./user";
import delay from "../utils/delay";

interface UserBody {
  currentData: {
    user?: { user: UserSummary };
  };
  code: number;
}

export default async function saveJudgements(
  logger: BaseLogger,
  prisma: PrismaClient,
) {
  const operations: PrismaPromise<unknown>[] = [];
  const users: JudgementProfile[] = [];

  let latestJudgement = await prisma.judgement.findFirst({
    orderBy: { time: "desc" },
  });

  if (latestJudgement === null) {
    latestJudgement = {
      time: new Date(0),
      userId: 0,
      content: "",
    };
  }

  const judgementData = (
    await parseApp(logger, "https://www.luogu.com.cn/judgement")
  ).querySelectorAll("li.feed-li > div.am-comment-main");

  judgementData.forEach((element) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const user = parseUser(element.querySelector(".feed-username")!);
    const judgement = { userId: user.id, ...parseComment(element) };
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (judgement.time <= latestJudgement!.time) return;
    users.push(user);
    operations.push(
      prisma.judgement.upsert({
        where: { time_userId: { time: judgement.time, userId: user.id } },
        create: judgement,
        update: judgement,
      }),
    );
  });

  // eslint-disable-next-line no-restricted-syntax
  for (const user of users) {
    // eslint-disable-next-line no-await-in-loop
    const response = await getResponse(
      logger,
      `https://www.luogu.com.cn/user/${user.id}?_contentOnly`,
      false,
    ).then((resp): Promise<UserBody> => resp.json());
    const userProfile = response.currentData.user?.user ?? {
      uid: user.id,
      name: user.name,
      badge: null,
      isAdmin: false,
      isBanned: true,
      color: user.color,
      ccfLevel: 0,
    };
    // eslint-disable-next-line no-await-in-loop
    await upsertUserSnapshotHook(prisma, userProfile);
    // eslint-disable-next-line no-await-in-loop
    await delay(250);
  }
  await prisma.$transaction(operations);
}
