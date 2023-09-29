import { Color, Forum } from "@prisma/client";

export const getPostUrl = (discussion: number, page?: number) =>
  `https://www.luogu.com.cn/discuss/${discussion}${
    page !== undefined ? `?page=${page}` : ""
  }`;

export const getUserUrl = (user: number) => `/user/${user}`;

export const getUserRealUrl = (user: number) =>
  `https://www.luogu.com.cn/user/${user}`;

export const getUserAvatarUrl = (user: number) =>
  `https://cdn.luogu.com.cn/upload/usericon/${user}.png`;

export const getForumUrl = (forum: Forum) =>
  `https://www.luogu.com.cn/discuss/lists?forumname=${forum.slug}`;

export const getForumName = (forum: Forum) => forum.name;

export const judgementUrl = "https://www.luogu.com.cn/judgement";

const isHTTPorHTTPS = (url: URL) =>
  (url.protocol === "https:" && ["", "443"].includes(url.port)) ||
  (url.protocol === "http:" && ["", "80"].includes(url.port));

const isLuoguUrl = (url: URL) =>
  url.hostname === "www.luogu.com.cn" && isHTTPorHTTPS(url);

const isLDAHackUrl = (url: URL) =>
  url.hostname === "www.luogu.com.co" && isHTTPorHTTPS(url);

const isLDAUrl = (url: URL) =>
  ["lglg.top", "cf.lglg.top", "hk.lglg.top"].includes(url.hostname) &&
  isHTTPorHTTPS(url);

export function getUserIdFromUrl(target: URL) {
  if (!isLuoguUrl(target)) return null;
  const uid = parseInt(
    (target.pathname.startsWith("/user/") && target.pathname.split("/")[2]) ||
      ((target.pathname === "/space/show" &&
        target.searchParams.get("uid")) as string),
    10
  );
  return Number.isNaN(uid) ? null : uid;
}

export function getDiscussionIdFromUrl(target: URL) {
  if (!isLuoguUrl(target) || !isLDAHackUrl(target)) return null;
  const discussionId = parseInt(
    (target.pathname.startsWith("/discuss/") &&
      target.pathname.split("/")[2]) ||
      ((target.pathname === "/discuss/show" &&
        target.searchParams.get("postid")) as string),
    10
  );
  return Number.isNaN(discussionId) ? null : discussionId;
}

export function getDiscussionIdFromLDAUrl(target: URL) {
  if (!isLDAUrl(target) || !/^d+$/.test(target.pathname.split("/")[1]))
    return null;
  const discussionId = parseInt(target.pathname.split("/")[1], 10);
  return Number.isNaN(discussionId) ? null : discussionId;
}

export function getDiscussionId(s: string) {
  const id = parseInt(s, 10);
  if (!Number.isNaN(id)) return id;
  const url = new URL(s);
  if (!isLuoguUrl(url)) return NaN;
  return parseInt(
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    (url.pathname === "/discuss/show" && url.searchParams.get("postid")) ||
      ((url.pathname.startsWith("/discuss/") &&
        url.pathname.split("/")[2]) as string),
    10
  );
}

export function getCheckmarkColor(ccfLevel: number) {
  if (ccfLevel <= 5) return "#52c41a";
  if (ccfLevel <= 7) return "#3498db";
  return "#ffc116";
}

export function getNameClassByColor(color: Color) {
  switch (color) {
    case "Blue":
      return "bluelight";
    case "Green":
      return "green";
    case "Gray":
      return "gray";
    case "Cheater":
      return "brown";
    case "Orange":
      return "orange";
    case "Purple":
      return "purple";
    case "Red":
      return "red";
  }
}
