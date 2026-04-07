export const DATABASE_CONFIG = {
  env: {
    uri: "MONGODB_URI",
    db: "MONGODB_DB",
  },
  fallbackDbName: "product-website",
  usersCollection: "users",
  missingUriMessage: "Missing MONGODB_URI environment variable.",
  duplicateKeyCode: 11000,
} as const;

export const SESSION_CONFIG = {
  cookieName: "session",
  fallbackSecret: "local-dev-auth-secret-change-me",
  sameSite: "lax",
  path: "/",
  durationMs: 7 * 24 * 60 * 60 * 1000,
  hmacAlgorithm: "sha256",
  tokenSeparator: ".",
  hashEncoding: "hex",
  base64Encoding: "base64url",
  utf8Encoding: "utf8",
} as const;
