import "server-only";

import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

import { appEnv } from "@/config/env";
import { DATABASE_CONFIG } from "@/constants/server";

declare global {
  var __sqliteDb__: DatabaseSync | undefined;
}

function getDatabasePath() {
  const configuredPath = appEnv.databasePath;

  if (!configuredPath) {
    throw new Error(DATABASE_CONFIG.missingPathMessage);
  }

  return resolve(process.cwd(), configuredPath);
}

function initializeDatabase(database: DatabaseSync) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS ${DATABASE_CONFIG.usersTable} (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS ${DATABASE_CONFIG.subscribersTable} (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
    )
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS ${DATABASE_CONFIG.refreshSessionsTable} (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_refresh_sessions_user_id
    ON ${DATABASE_CONFIG.refreshSessionsTable} (user_id)
  `);
}

export function getDatabase() {
  if (!global.__sqliteDb__) {
    const databasePath = getDatabasePath();
    mkdirSync(dirname(databasePath), { recursive: true });

    global.__sqliteDb__ = new DatabaseSync(databasePath);
    initializeDatabase(global.__sqliteDb__);
  }

  return global.__sqliteDb__;
}

export function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Error &&
    "code" in error &&
    error.code === DATABASE_CONFIG.uniqueConstraintCode &&
    error.message.includes("UNIQUE constraint failed")
  );
}
