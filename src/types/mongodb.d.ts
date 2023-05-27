import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var, vars-on-top, @typescript-eslint/naming-convention
  var _mongoClientPromise: Promise<MongoClient>?;
}
