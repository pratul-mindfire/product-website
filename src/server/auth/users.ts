import "server-only";

import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

import { AUTH_VALIDATION } from "@/constants/auth";
import { SESSION_CONFIG } from "@/constants/server";
import {
  getDatabase,
  isUniqueConstraintError,
} from "@/server/db/sqlite";

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
  return getDatabase();
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

  const database = await getUsersCollection();
  const existingUser = database
    .prepare(
      `
        SELECT id, name, email, password_hash, created_at
        FROM users
        WHERE email = ?
      `,
    )
    .get(email) as
    | {
        id: string;
        name: string;
        email: string;
        password_hash: string;
        created_at: string;
      }
    | undefined;

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
    database
      .prepare(
        `
          INSERT INTO users (id, name, email, password_hash, created_at)
          VALUES (?, ?, ?, ?, ?)
        `,
      )
      .run(user.id, user.name, user.email, user.passwordHash, user.createdAt);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
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
  const database = await getUsersCollection();
  const row = database
    .prepare(
      `
        SELECT id, name, email, password_hash, created_at
        FROM users
        WHERE email = ?
      `,
    )
    .get(email) as
    | {
        id: string;
        name: string;
        email: string;
        password_hash: string;
        created_at: string;
      }
    | undefined;

  const user = row
    ? {
        id: row.id,
        name: row.name,
        email: row.email,
        passwordHash: row.password_hash,
        createdAt: row.created_at,
      }
    : null;

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { ok: false as const, error: AUTH_VALIDATION.invalidCredentials };
  }

  return {
    ok: true as const,
    user: mapUser(user),
  };
}

export async function getUserById(id: string): Promise<SessionUser | null> {
  const database = await getUsersCollection();
  const row = database
    .prepare(
      `
        SELECT id, name, email
        FROM users
        WHERE id = ?
      `,
    )
    .get(id) as { id: string; name: string; email: string } | undefined;

  if (!row) {
    return null;
  }

  return mapUser(row);
}
