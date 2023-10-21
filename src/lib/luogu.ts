export const getDiscussionUrl = (discussion: number, page?: number) =>
  `https://www.luogu.com.cn/discuss/${discussion}${
    page !== undefined ? `?page=${page}` : ""
  }`;

export const getUserUrl = (user: number) => `/user/${user}`;

export const getUserRealUrl = (user: number) =>
  `https://www.luogu.com.cn/user/${user}`;

export const getUserAvatarUrl = (user: number) =>
  `https://cdn.luogu.com.cn/upload/usericon/${user}.png`;

export const getForumUrl = (forum: string) =>
  `https://www.luogu.com.cn/discuss/lists?forumname=${forum}`;

export const getForumName = (forum: string) =>
  ({
    siteaffairs: "站务版",
    problem: "题目总版",
    academics: "学术版",
    relevantaffairs: "灌水区",
    service: "反馈、申请、工单专版",
    miaomiaowu: "小黑屋",
  })[forum] ?? forum;

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
    10,
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
    10,
  );
  return Number.isNaN(discussionId) ? null : discussionId;
}

export function getDiscussionIdFromLDAUrl(target: URL) {
  if (!isLDAUrl(target) || !/^d+$/.test(target.pathname.split("/")[1]))
    return null;
  const discussionId = parseInt(target.pathname.split("/")[1], 10);
  return Number.isNaN(discussionId) ? null : discussionId;
}
