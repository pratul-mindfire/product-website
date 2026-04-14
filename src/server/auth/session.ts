import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { appEnv } from "@/config/env";
import { SESSION_CONFIG } from "@/constants/server";
import { getUserById, type SessionUser } from "@/server/auth/users";

function getSessionSecret() {
  return appEnv.authSecret;
}

function encodePayload(payload: object) {
  return Buffer.from(JSON.stringify(payload)).toString(
    SESSION_CONFIG.base64Encoding,
  );
}

function decodePayload<T>(value: string) {
  return JSON.parse(
    Buffer.from(value, SESSION_CONFIG.base64Encoding).toString(
      SESSION_CONFIG.utf8Encoding,
    ),
  ) as T;
}

function sign(value: string) {
  return createHmac(SESSION_CONFIG.hmacAlgorithm, getSessionSecret())
    .update(value)
    .digest(SESSION_CONFIG.base64Encoding);
}

function createToken(userId: string, expiresAt: number) {
  const payload = encodePayload({ userId, expiresAt });
  const signature = sign(payload);
  return `${payload}${SESSION_CONFIG.tokenSeparator}${signature}`;
}

function verifyToken(token: string) {
  const [payload, signature] = token.split(SESSION_CONFIG.tokenSeparator);

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  const parsed = decodePayload<{ userId: string; expiresAt: number }>(payload);

  if (!parsed.userId || !parsed.expiresAt || parsed.expiresAt < Date.now()) {
    return null;
  }

  return parsed;
}

export async function createSession(userId: string) {
  const expiresAt = Date.now() + SESSION_CONFIG.durationMs;
  const token = createToken(userId, expiresAt);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_CONFIG.cookieName, token, {
    httpOnly: true,
    secure: appEnv.nodeEnv === "production",
    sameSite: SESSION_CONFIG.sameSite,
    expires: new Date(expiresAt),
    path: SESSION_CONFIG.path,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_CONFIG.cookieName);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_CONFIG.cookieName)?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);

  if (!payload) {
    return null;
  }

  return getUserById(payload.userId);
}
