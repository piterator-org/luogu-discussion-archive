import type { BaseLogger } from "pino";
import type { PrismaClient } from "@prisma/client";
import { getResponse } from "./parser";

interface LegacyDiscussList {
  status: 200;
  data: {
    count: number;
    result: {
      PostID: number;
      Title: string;
      Author: { _instance: "Luogu\\Model\\User\\User" };
      Forum: {
        Forum: {
          ForumID: number;
          Name: string;
          InternalName: string;
          _instance: "Luogu\\Model\\Discuss\\Forum";
        };
      };
      Top: number;
      SubmitTime: number;
      isValid: boolean;
      LatestReply: {
        Author: { _instance: "Luogu\\Model\\User\\User" };
        ReplyTime: number;
        Content: string;
        _instance: "Luogu\\Model\\Discuss\\PostReply";
      } | null;
      RepliesCount: number;
      _instance: "Luogu\\Model\\Discuss\\Post";
    }[];
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
    `https://www.luogu.com/api/discuss?page=${page}`,
    false,
  );
  const {
    data: { result },
  } = (await response.json()) as LegacyDiscussList;
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
              .filter((post) => post.SubmitTime < after)
              .map((post) => post.PostID),
          },
        },
      })
    ).map(({ id, replies }) => [id, replies[0]?.time]),
  );
  return result
    .filter(
      (post) =>
        post.SubmitTime >= after ||
        !(post.PostID in saved) ||
        (post.LatestReply &&
          (!saved[post.PostID] ||
            Math.floor(saved[post.PostID].getTime() / 60000) !==
              Math.floor(post.LatestReply.ReplyTime / 60))),
    )
    .map((post) => post.PostID);
}
