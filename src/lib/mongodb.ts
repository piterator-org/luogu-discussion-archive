import { MongoClient } from "mongodb";
import type { Discussion, User } from "@/types/mongodb";

if (!process.env.MONGO_URI)
  throw Error(
    'Missing environment variable: "MONGO_URI". Did you forget to add your MongoDB connection URI to .env.local?'
  );

const url = process.env.MONGO_URI;
const options = {};

const clientPromise =
  process.env.NODE_ENV === "development"
    ? // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      global._mongoClientPromise ??
      (global._mongoClientPromise = new MongoClient(url, options).connect())
    : // In production mode, it's best to not use a global variable.
      new MongoClient(url, options).connect();

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

const dbPromise = clientPromise.then((client) =>
  client.db("luoguDiscussionArchive")
);

export const collection = dbPromise.then((db) =>
  db.collection<Discussion>("discussions")
);

export const users = dbPromise.then((db) => db.collection<User>("users"));
