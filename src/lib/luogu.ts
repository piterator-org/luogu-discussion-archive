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
