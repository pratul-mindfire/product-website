import "server-only";

import { MongoClient } from "mongodb";

import { DATABASE_CONFIG } from "@/constants/server";

declare global {
  var __mongoClientPromise__: Promise<MongoClient> | undefined;
}

function getMongoUri() {
  const uri = process.env[DATABASE_CONFIG.env.uri];

  if (!uri) {
    throw new Error(DATABASE_CONFIG.missingUriMessage);
  }

  return uri;
}

function getMongoDbName() {
  return process.env[DATABASE_CONFIG.env.db] ?? DATABASE_CONFIG.fallbackDbName;
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
      .collection(DATABASE_CONFIG.usersCollection)
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
