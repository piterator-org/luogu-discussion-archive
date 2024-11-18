import type { PrismaClient, PrismaPromise } from "@prisma/client";
import type { BaseLogger } from "pino";
import { getResponse } from "./parser";
import { UserSummary, upsertUserSnapshot } from "./user";
import lgUrl from "../utils/url";

interface JudgementBody {
  user: UserSummary;
  reason: string;
  time: number;
  revokedPermission: number;
  addedPermission: number;
}

interface JudgementResponse {
  currentData: {
    logs: JudgementBody[];
  };
}

export default async function saveJudgements(
  logger: BaseLogger,
  prisma: PrismaClient,
) {
  const res = await getResponse(logger, lgUrl(`/judgement`, false), false).then(
    (response): Promise<JudgementResponse> => response.json(),
  );

  const operations: PrismaPromise<unknown>[] = [];
  const judgements = res.currentData.logs;

  const latestJudgement = (await prisma.judgement.findFirst({
    orderBy: { time: "desc" },
  })) ?? {
    time: new Date(0),
    userId: 0,
    reason: "",
    permissionGranted: 0,
    permissionRevoked: 0,
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const judgement of judgements) {
    // eslint-disable-next-line no-await-in-loop
    await upsertUserSnapshot(prisma, judgement.user);
    if (new Date(judgement.time * 1000) <= latestJudgement.time) break;
    operations.push(
      prisma.judgement.upsert({
        where: {
          time_userId: {
            time: new Date(judgement.time * 1000),
            userId: judgement.user.uid,
          },
        },
        create: {
          userId: judgement.user.uid,
          reason: judgement.reason,
          permissionGranted: judgement.addedPermission,
          permissionRevoked: judgement.revokedPermission,
          time: new Date(judgement.time * 1000),
        },
        update: {},
      }),
    );
  }
  await prisma.$transaction(operations);
}
