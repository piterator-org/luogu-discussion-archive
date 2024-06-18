import type { BaseLogger } from "pino";
import type { PrismaClient } from "@prisma/client";
import type { UserSummary } from "./user";
import type { ForumData, ReplyContent } from "./post";
import { getResponse } from "./parser";

interface PostData {
  id: number;
  title: string;
  author: UserSummary;
  time: number;
  forum: ForumData;
  topped: boolean;
  valid: boolean;
  locked: false;
  replyCount: number;
  recentReply: ReplyContent | false;
}

interface PostListResponse {
  code: 200;
  currentTemplate: "DiscussList";
  currentData: {
    forum: ForumData | null;
    publicForums: ForumData[];
    posts: {
      perPage: number;
      count: number;
      result: PostData[];
    };
    canPost: boolean;
  };
}

export default async function getPostList(
  logger: BaseLogger,
  prisma: PrismaClient,
  page: number,
  after: number,
) {
  const response = await getResponse(
    logger,
    `https://www.luogu.com/discuss?_contentOnly&page=${page}`,
    false,
  );
  const {
    currentData: {
      posts: { result },
    },
  } = (await response.json()) as PostListResponse;
  const saved = Object.fromEntries(
    (
      await prisma.post.findMany({
        select: {
          id: true,
          replies: { select: { time: true }, orderBy: { id: "desc" }, take: 1 },
        },
        where: {
          id: {
            in: result
              .filter((post) => post.time < after)
              .map((post) => post.id),
          },
        },
      })
    ).map(({ id, replies }) => [id, replies[0]?.time]),
  );
  return result
    .filter(
      (post) =>
        post.time >= after ||
        !(post.id in saved) ||
        (post.recentReply &&
          (!saved[post.id] ||
            Math.floor(saved[post.id].getTime() / 60000) !==
              Math.floor(post.recentReply.time / 60))),
    )
    .map((post) => post.id);
}
