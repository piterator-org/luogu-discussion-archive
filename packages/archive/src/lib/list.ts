import type { BaseLogger } from "pino";
import { getReponse } from "./parser";

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

export default async function getDiscussionList(
  logger: BaseLogger,
  page: number,
  after: number
) {
  const response = await getReponse(
    logger,
    `https://www.luogu.com.cn/api/discuss?page=${page}`
  );
  const {
    data: { result },
  } = (await response.json()) as LegacyDiscussList;
  return result
    .filter((post) => post.SubmitTime >= after)
    .map((post) => post.PostID);
}
