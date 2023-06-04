export function getDiscussionUrl(discussion: number, page?: number) {
  return `https://www.luogu.com.cn/discuss/${discussion}${
    page !== undefined ? `?page=${page}` : ""
  }`;
}

export function getUserUrl(user: number) {
  return `https://www.luogu.com.cn/user/${user}`;
}

export function getUserAvatarUrl(user: number) {
  return `https://cdn.luogu.com.cn/upload/usericon/${user}.png`;
}

export function getForumUrl(forum: string) {
  return `https://www.luogu.com.cn/discuss/lists?forumname=${forum}`;
}

export function getForumName(forum: string) {
  return (
    {
      siteaffairs: "站务版",
      problem: "题目总版",
      academics: "学术版",
      relevantaffairs: "灌水区",
      service: "反馈、申请、工单专版",
    }[forum] ?? forum
  );
}
