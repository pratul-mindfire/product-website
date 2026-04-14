import { DATABASE_CONFIG, SESSION_CONFIG } from "@/constants/server";

function readEnvValue(name: string) {
  return process.env[name];
}

export const appEnv = {
  nodeEnv: readEnvValue("NODE_ENV") ?? "development",
  authSecret: readEnvValue("AUTH_SECRET") ?? SESSION_CONFIG.fallbackSecret,
  mongodbUri: readEnvValue(DATABASE_CONFIG.env.uri),
  mongodbDb:
    readEnvValue(DATABASE_CONFIG.env.db) ?? DATABASE_CONFIG.fallbackDbName,
  cmsBaseUrl: process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") ?? "",
} as const;
