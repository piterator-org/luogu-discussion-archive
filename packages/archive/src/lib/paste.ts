import type { BaseLogger } from "pino";
import type { PrismaClient } from "@prisma/client";

type Color = "Gray" | "Blue" | "Green" | "Orange" | "Red" | "Purple";

interface UserSummary {
  uid: number;
  name: string;
  slogan: string | null;
  badge: string | null;
  isAdmin: boolean;
  isBanned: boolean;
  color: Color;
  ccfLevel: number;
  background: string;
  isRoot?: true;
}

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

const colors = {
  Gray: "gray",
  Blue: "bluelight",
  Green: "green",
  Orange: "orange",
  Red: "red",
  Purple: "purple",
};

function getCheckmark(ccfLevel: number) {
  // https://help.luogu.com.cn/manual/luogu/account/award-certify#%E8%AE%A4%E8%AF%81%E5%90%8E%E6%9C%89%E4%BB%80%E4%B9%88%E7%94%A8
  if (!ccfLevel) return null;
  if (ccfLevel >= 3 && ccfLevel <= 5) return "#5eb95e";
  if (ccfLevel >= 6 && ccfLevel <= 7) return "#3498db";
  if (ccfLevel >= 8) return "#f1c40f";
  throw Error(`Unknown CCF Level: ${ccfLevel}`);
}

export default async function savePaste(
  logger: BaseLogger,
  prisma: PrismaClient,
  id: string
) {
  const url = `https://www.luogu.com.cn/paste/${id}?_contentOnly`;
  const response = await fetch(url);
  logger.info(
    { url, status: response.status, statusText: response.statusText },
    "fetch"
  );
  if (!response.ok) throw Error(response.statusText);
  const json = (await response.json()) as
    | { code: 403 | 404; currentData: LuoguError }
    | { code: 200; currentData: { paste: Paste } };
  if (json.code !== 200) throw Error(json.currentData.errorMessage);
  const { paste } = json.currentData;
  const user = {
    username: paste.user.name,
    color: colors[paste.user.color],
    checkmark: getCheckmark(paste.user.ccfLevel),
    badge: paste.user.badge,
  };
  const snapshot = await prisma.pasteSnapshot.findFirst({
    where: { pasteId: paste.id },
    orderBy: { time: "desc" },
  });
  await prisma.$transaction([
    prisma.user.upsert({
      where: { id: paste.user.uid },
      create: { ...user, id: paste.user.uid },
      update: user,
    }),
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
          data: { pasteId: paste.id, data: paste.data },
        }),
  ]);
}
