export const getDiscussionUrl = (discussion: number, page?: number) =>
  `https://www.luogu.com.cn/discuss/${discussion}${
    page !== undefined ? `?page=${page}` : ""
  }`;

export const getUserUrl = (user: number) =>
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
  }[forum] ?? forum);

export const judgementUrl = "https://www.luogu.com.cn/judgement";

export const isUserUrl = (target: URL) =>
  target.hostname === "www.luogu.com.cn" &&
  ((target.protocol === "https:" && ["", "443"].includes(target.port)) ||
    (target.protocol === "http:" && ["", "80"].includes(target.port))) &&
  /^\/user\/\d+$/.test(target.pathname);

export const getUserIdFromUrl = (target: URL) =>
  parseInt(target.pathname.split("/")[2], 10);
