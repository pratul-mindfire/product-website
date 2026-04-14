import "server-only";

import {
  createHash,
  randomBytes,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";

import { DATABASE_CONFIG, SESSION_CONFIG } from "@/constants/server";
import { getDatabase } from "@/server/db/sqlite";

type StoredRefreshSession = {
  created_at: number;
  expires_at: number;
  id: string;
  token_hash: string;
  user_id: string;
};

function hashRefreshTokenSecret(secret: string) {
  return createHash("sha256")
    .update(secret)
    .digest(SESSION_CONFIG.hashEncoding);
}

function getRefreshCookieParts(token: string) {
  const [sessionId, secret] = token.split(SESSION_CONFIG.tokenSeparator);

  if (!sessionId || !secret) {
    return null;
  }

  return { sessionId, secret };
}

function getStoredRefreshSession(sessionId: string) {
  return getDatabase()
    .prepare(
      `
        SELECT id, user_id, token_hash, expires_at, created_at
        FROM ${DATABASE_CONFIG.refreshSessionsTable}
        WHERE id = ?
      `,
    )
    .get(sessionId) as StoredRefreshSession | undefined;
}

export function createRefreshSession(userId: string) {
  const sessionId = randomUUID();
  const secret = randomBytes(32).toString(SESSION_CONFIG.base64Encoding);
  const expiresAt = Date.now() + SESSION_CONFIG.refreshTokenDurationMs;
  const createdAt = Date.now();

  getDatabase()
    .prepare(
      `
        INSERT INTO ${DATABASE_CONFIG.refreshSessionsTable}
          (id, user_id, token_hash, expires_at, created_at)
        VALUES (?, ?, ?, ?, ?)
      `,
    )
    .run(
      sessionId,
      userId,
      hashRefreshTokenSecret(secret),
      expiresAt,
      createdAt,
    );

  return {
    expiresAt,
    token: `${sessionId}${SESSION_CONFIG.tokenSeparator}${secret}`,
  };
}

export function rotateRefreshSession(token: string) {
  const parts = getRefreshCookieParts(token);

  if (!parts) {
    return null;
  }

  const storedSession = getStoredRefreshSession(parts.sessionId);

  if (!storedSession) {
    return null;
  }

  if (storedSession.expires_at < Date.now()) {
    revokeRefreshSessionById(storedSession.id);
    return null;
  }

  const providedHash = Buffer.from(hashRefreshTokenSecret(parts.secret));
  const storedHash = Buffer.from(storedSession.token_hash);

  if (providedHash.length !== storedHash.length) {
    return null;
  }

  if (!timingSafeEqual(providedHash, storedHash)) {
    return null;
  }

  const nextSecret = randomBytes(32).toString(SESSION_CONFIG.base64Encoding);
  const expiresAt = Date.now() + SESSION_CONFIG.refreshTokenDurationMs;

  getDatabase()
    .prepare(
      `
        UPDATE ${DATABASE_CONFIG.refreshSessionsTable}
        SET token_hash = ?, expires_at = ?
        WHERE id = ?
      `,
    )
    .run(hashRefreshTokenSecret(nextSecret), expiresAt, storedSession.id);

  return {
    expiresAt,
    token: `${storedSession.id}${SESSION_CONFIG.tokenSeparator}${nextSecret}`,
    userId: storedSession.user_id,
  };
}

export function revokeRefreshSession(token: string | null | undefined) {
  if (!token) {
    return;
  }

  const parts = getRefreshCookieParts(token);

  if (!parts) {
    return;
  }

  revokeRefreshSessionById(parts.sessionId);
}

function revokeRefreshSessionById(sessionId: string) {
  getDatabase()
    .prepare(
      `
        DELETE FROM ${DATABASE_CONFIG.refreshSessionsTable}
        WHERE id = ?
      `,
    )
    .run(sessionId);
}
