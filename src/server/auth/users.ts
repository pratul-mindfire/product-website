import "server-only";

import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { MongoServerError } from "mongodb";

import { getDatabase } from "@/server/db/mongodb";

type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashPassword(
  password: string,
  salt = randomBytes(16).toString("hex"),
) {
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedHash] = passwordHash.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const inputHash = scryptSync(password, salt, 64);
  const expectedHash = Buffer.from(storedHash, "hex");

  if (inputHash.length !== expectedHash.length) {
    return false;
  }

  return timingSafeEqual(inputHash, expectedHash);
}

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

function mapUser(user: Pick<StoredUser, "id" | "name" | "email">): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

async function getUsersCollection() {
  const database = await getDatabase();
  return database.collection<StoredUser>("users");
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (name.length < 2) {
    return { ok: false as const, error: "Name must be at least 2 characters." };
  }

  if (!email.includes("@")) {
    return { ok: false as const, error: "Enter a valid email address." };
  }

  if (password.length < 6) {
    return {
      ok: false as const,
      error: "Password must be at least 6 characters.",
    };
  }

  const users = await getUsersCollection();
  const existingUser = await users.findOne({ email });

  if (existingUser) {
    return {
      ok: false as const,
      error: "An account with this email already exists.",
    };
  }

  const user: StoredUser = {
    id: randomUUID(),
    name,
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  try {
    await users.insertOne(user);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return {
        ok: false as const,
        error: "An account with this email already exists.",
      };
    }

    throw error;
  }

  return {
    ok: true as const,
    user: mapUser(user),
  };
}

export async function authenticateUser(input: {
  email: string;
  password: string;
}) {
  const email = normalizeEmail(input.email);
  const password = input.password;
  const users = await getUsersCollection();
  const user = await users.findOne({ email });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { ok: false as const, error: "Invalid email or password." };
  }

  return {
    ok: true as const,
    user: mapUser(user),
  };
}

export async function getUserById(id: string): Promise<SessionUser | null> {
  const users = await getUsersCollection();
  const user = await users.findOne({ id });

  if (!user) {
    return null;
  }

  return mapUser(user);
}
