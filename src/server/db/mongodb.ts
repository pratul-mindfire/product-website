import "server-only";

import { MongoClient } from "mongodb";

import { appEnv } from "@/config/env";
import { DATABASE_CONFIG } from "@/constants/server";

declare global {
  var __mongoClientPromise__: Promise<MongoClient> | undefined;
}

function getMongoUri() {
  const uri = appEnv.mongodbUri;

  if (!uri) {
    throw new Error(DATABASE_CONFIG.missingUriMessage);
  }

  return uri;
}

function getMongoDbName() {
  return appEnv.mongodbDb;
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
    const database = client.db(getMongoDbName());

    indexesPromise = Promise.all([
      database
        .collection(DATABASE_CONFIG.usersCollection)
        .createIndex({ email: 1 }, { unique: true }),
      database
        .collection(DATABASE_CONFIG.subscribersCollection)
        .createIndex({ email: 1 }, { unique: true }),
    ]).then(() => undefined);
  }

  await indexesPromise;
}

export async function getDatabase() {
  const client = await getClientPromise();
  await ensureIndexes(client);
  return client.db(getMongoDbName());
}
