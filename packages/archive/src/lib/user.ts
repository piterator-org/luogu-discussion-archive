import type { Color, PrismaClient, User } from "@prisma/client";

export interface UserSummary {
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

const colors: Record<Color, string> = {
  Cheater: "brown",
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

const extractUser = (user: UserSummary): Omit<User, "id"> => ({
  username: user.name,
  color: colors[user.color],
  checkmark: getCheckmark(user.ccfLevel),
  badge: user.badge,
});

// https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields#excluding-the-password-field
const exclude = <Key extends keyof UserSummary>(
  user: UserSummary,
  keys: Key[],
) =>
  Object.fromEntries(
    (Object.entries(user) as [Key, unknown][]).filter(
      ([key]) => !keys.includes(key),
    ),
  ) as Omit<UserSummary, Key>;

export function upsertUser(prisma: PrismaClient, summary: UserSummary) {
  const user = extractUser(summary);
  const profile = exclude(summary, ["uid"]);
  return prisma.user.upsert({
    where: { id: summary.uid },
    create: { ...user, profile: { create: profile }, id: summary.uid },
    update: {
      ...user,
      profile: {
        upsert: {
          where: { uid: summary.uid },
          create: profile,
          update: profile,
        },
      },
    },
  });
}
