import "server-only";

import { MongoClient } from "mongodb";

declare global {
  var __mongoClientPromise__: Promise<MongoClient> | undefined;
}

function getMongoUri() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  return uri;
}

function getMongoDbName() {
  return process.env.MONGODB_DB ?? "product-website";
}

function getClientPromise() {
  if (!global.__mongoClientPromise__) {
    global.__mongoClientPromise__ = new MongoClient(getMongoUri()).connect();
  }

  return global.__mongoClientPromise__;
}

let indexesPromise: Promise<void> | null = null;

async function ensureIndexes(client: MongoClient) {
  if (!indexesPromise) {
    indexesPromise = client
      .db(getMongoDbName())
      .collection("users")
      .createIndex({ email: 1 }, { unique: true })
      .then(() => undefined);
  }

  await indexesPromise;
}

export async function getDatabase() {
  const client = await getClientPromise();
  await ensureIndexes(client);
  return client.db(getMongoDbName());
}
