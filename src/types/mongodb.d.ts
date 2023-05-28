import { MongoClient } from "mongodb";
import { Reply } from "@/lib/fetch";

declare global {
  // eslint-disable-next-line no-var, vars-on-top, @typescript-eslint/naming-convention
  var _mongoClientPromise: Promise<MongoClient>?;
}

export interface Discussion {
  _id: number;
  lastUpdate: Date;
  forum: string;
  author: number;
  time: Date;
  content: string;
  replies: Reply[];
}

export interface User {
  _id: number;
  username: string;
  color: string;
  checkmark: string;
  badge: string;
}
