import type { BaseLogger } from "pino";
import type { PrismaClient } from "@prisma/client";
import { getResponse } from "./parser";
import { type UserSummary } from "./user";
import { upsertUserSnapshotHook } from "./user";

interface Paste {
  data: string;
  id: string;
  user: UserSummary;
  time: number;
  public: boolean;
}

interface LuoguError {
  errorType: string;
  errorMessage: string;
  errorTrace: string;
}

export default async function savePaste(
  logger: BaseLogger,
  prisma: PrismaClient,
  id: string,
) {
  const response = await getResponse(
    logger,
    `https://www.luogu.com.cn/paste/${id}?_contentOnly`,
  );
  const json = (await response.json()) as
    | { code: 403 | 404; currentData: LuoguError }
    | { code: 200; currentData: { paste: Paste } };
  const snapshot = await prisma.pasteSnapshot.findFirst({
    where: { pasteId: id },
    orderBy: { time: "desc" },
  });
  if (json.code === 403 && snapshot) {
    await (snapshot.public
      ? prisma.pasteSnapshot.create({
          data: { pasteId: id, public: false, data: null },
        })
      : prisma.pasteSnapshot.update({
          where: {
            pasteId_time: { pasteId: snapshot.pasteId, time: snapshot.time },
          },
          data: { until: new Date() },
        }));
    return;
  }
  if (json.code !== 200) throw Error(json.currentData.errorMessage);
  const { paste } = json.currentData;
  await upsertUserSnapshotHook(prisma, paste.user);
  await prisma.$transaction([
    prisma.paste.upsert({
      where: { id: paste.id },
      create: {
        id: paste.id,
        time: new Date(paste.time * 1000),
        userId: paste.user.uid,
      },
      update: {},
    }),
    snapshot?.data === paste.data
      ? prisma.pasteSnapshot.update({
          where: {
            pasteId_time: { pasteId: snapshot.pasteId, time: snapshot.time },
          },
          data: { until: new Date() },
        })
      : prisma.pasteSnapshot.create({
          data: { pasteId: paste.id, public: paste.public, data: paste.data },
        }),
  ]);
}
