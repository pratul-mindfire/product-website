import "server-only";

import { randomUUID } from "node:crypto";

import {
  getDatabase,
  isUniqueConstraintError,
} from "@/server/db/sqlite";

type Subscriber = {
  createdAt: string;
  email: string;
  id: string;
};

async function getSubscribersCollection() {
  return getDatabase();
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
    const subscriber: Subscriber = {
      id: randomUUID(),
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
    };

    (await getSubscribersCollection())
      .prepare(
        `
          INSERT INTO subscribers (id, email, created_at)
          VALUES (?, ?, ?)
        `,
      )
      .run(subscriber.id, subscriber.email, subscriber.createdAt);

    return { ok: true as const };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: true as const };
    }

    return {
      ok: false as const,
      error: "Subscription failed. Please try again.",
    };
  }
}
