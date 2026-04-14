import "server-only";

import { randomUUID } from "node:crypto";

import { MongoServerError } from "mongodb";

import { DATABASE_CONFIG } from "@/constants/server";
import { getDatabase } from "@/server/db/mongodb";

type Subscriber = {
  createdAt: string;
  email: string;
  id: string;
};

async function getSubscribersCollection() {
  const database = await getDatabase();
  return database.collection<Subscriber>(DATABASE_CONFIG.subscribersCollection);
}

export async function subscribeEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    return {
      ok: false as const,
      error: "Please enter a valid email address.",
    };
  }

  try {
    await (
      await getSubscribersCollection()
    ).insertOne({
      id: randomUUID(),
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
    });

    return { ok: true as const };
  } catch (error) {
    if (
      error instanceof MongoServerError &&
      error.code === DATABASE_CONFIG.duplicateKeyCode
    ) {
      return { ok: true as const };
    }

    return {
      ok: false as const,
      error: "Subscription failed. Please try again.",
    };
  }
}
