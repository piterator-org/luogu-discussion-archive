import type { BaseLogger } from "pino";
import type { PrismaClient } from "@prisma/client";
import type { UserSummary } from "./user";
import type { ForumData, ReplyContent } from "./post";
import { getResponse } from "./parser";
import lgUrl from "../utils/url";

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
  data: {
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
    lgUrl(`/discuss?page=${page}`),
    false,
  );
  const {
    data: {
      posts: { result },
    },
  } = (await response.json()) as PostListResponse;
  const saved = Object.fromEntries(
    (
      await prisma.post.findMany({
        select: {
          id: true,
          replies: {
            select: { id: true },
            orderBy: { id: "desc" },
            take: 1,
          },
        },
        where: {
          id: {
            in: result
              .filter((post) => post.time < after)
              .map((post) => post.id),
          },
        },
      })
    ).map(({ id, replies }) => [id, replies[0]?.id as number | undefined]),
  );
  return result
    .filter(
      (post) =>
        post.time >= after || // 晚于特定时间则一定尝试保存
        !(post.id in saved) || // 没有保存过亦如此
        (post.recentReply && // 有回复并
          (!saved[post.id] || // 上一次保存时没有回复或
            /* eslint-disable @typescript-eslint/no-non-null-assertion */
            saved[post.id]! < post.recentReply.id)), // 存在更新的回复（该 id 随时间单调递增）
    )
    .map((post) => post.id);
}
