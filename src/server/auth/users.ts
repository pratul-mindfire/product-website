import "server-only";

import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { MongoServerError } from "mongodb";

import { AUTH_VALIDATION } from "@/constants/auth";
import { DATABASE_CONFIG, SESSION_CONFIG } from "@/constants/server";
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
  salt = randomBytes(16).toString(SESSION_CONFIG.hashEncoding),
) {
  const derivedKey = scryptSync(password, salt, 64).toString(
    SESSION_CONFIG.hashEncoding,
  );
  return `${salt}:${derivedKey}`;
}

function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedHash] = passwordHash.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const inputHash = scryptSync(password, salt, 64);
  const expectedHash = Buffer.from(storedHash, SESSION_CONFIG.hashEncoding);

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
  return database.collection<StoredUser>(DATABASE_CONFIG.usersCollection);
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (name.length < AUTH_VALIDATION.minNameLength) {
    return { ok: false as const, error: AUTH_VALIDATION.invalidName };
  }

  if (!email.includes("@")) {
    return { ok: false as const, error: AUTH_VALIDATION.invalidEmail };
  }

  if (password.length < AUTH_VALIDATION.minPasswordLength) {
    return {
      ok: false as const,
      error: AUTH_VALIDATION.invalidPassword,
    };
  }

  const users = await getUsersCollection();
  const existingUser = await users.findOne({ email });

  if (existingUser) {
    return {
      ok: false as const,
      error: AUTH_VALIDATION.duplicateEmail,
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
    if (
      error instanceof MongoServerError &&
      error.code === DATABASE_CONFIG.duplicateKeyCode
    ) {
      return {
        ok: false as const,
        error: AUTH_VALIDATION.duplicateEmail,
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
    return { ok: false as const, error: AUTH_VALIDATION.invalidCredentials };
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
