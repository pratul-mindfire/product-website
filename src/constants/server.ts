export const DATABASE_CONFIG = {
  env: {
    path: "DATABASE_PATH",
  },
  usersTable: "users",
  subscribersTable: "subscribers",
  refreshSessionsTable: "refresh_sessions",
  defaultPath: "./data/product-website.db",
  missingPathMessage: "Missing DATABASE_PATH environment variable.",
  uniqueConstraintCode: "ERR_SQLITE_ERROR",
} as const;

export const CMS_CONFIG = {
  env: {
    baseUrl: "NEXT_PUBLIC_STRAPI_URL",
  },
  missingBaseUrlMessage:
    "Missing NEXT_PUBLIC_STRAPI_URL for landing page content.",
} as const;

export const SESSION_CONFIG = {
  fallbackSecret: "local-dev-auth-secret-change-me",
  accessTokenDurationMs: 24 * 60 * 60 * 1000,
  refreshTokenDurationMs: 7 * 24 * 60 * 60 * 1000,
  refreshIntervalMs: 12 * 60 * 60 * 1000,
  tokenSeparator: ".",
  hashEncoding: "hex",
  base64Encoding: "base64url",
} as const;
