import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { createHmac } from "node:crypto";

import { APP_ROUTES } from "@/constants/app";
import { AUTH_VALIDATION } from "@/constants/auth";
import { appEnv } from "@/config/env";
import { SESSION_CONFIG } from "@/constants/server";
import {
  createRefreshSession,
  revokeRefreshSession,
  rotateRefreshSession,
} from "@/server/auth/refresh-tokens";
import { authenticateUser } from "@/server/auth/users";

type AppToken = JWT & {
  accessToken?: string;
  accessTokenExpires?: number;
  email?: string | null;
  error?: "RefreshAccessTokenError";
  name?: string | null;
  refreshToken?: string;
  refreshTokenExpires?: number;
  userId?: string;
};

type AccessTokenPayload = {
  exp: number;
  iat: number;
  sub: string;
  type: "access";
};

function encodeTokenPart(value: object) {
  return Buffer.from(JSON.stringify(value)).toString(SESSION_CONFIG.base64Encoding);
}

function signToken(unsignedToken: string) {
  return createHmac("sha256", appEnv.authSecret)
    .update(unsignedToken)
    .digest(SESSION_CONFIG.base64Encoding);
}

function createAccessToken(userId: string) {
  const issuedAtSeconds = Math.floor(Date.now() / 1000);
  const expiresAtSeconds = Math.floor(
    (Date.now() + SESSION_CONFIG.accessTokenDurationMs) / 1000,
  );

  const header = encodeTokenPart({
    alg: "HS256",
    typ: "JWT",
  });
  const payload = encodeTokenPart({
    sub: userId,
    type: "access",
    iat: issuedAtSeconds,
    exp: expiresAtSeconds,
  } satisfies AccessTokenPayload);
  const unsignedToken = `${header}.${payload}`;
  const signature = signToken(unsignedToken);

  return `${unsignedToken}.${signature}`;
}

async function refreshAccessToken(token: AppToken): Promise<AppToken> {
  if (!token.refreshToken) {
    return { ...token, error: "RefreshAccessTokenError" };
  }

  const refreshedSession = rotateRefreshSession(token.refreshToken);

  if (!refreshedSession) {
    return { ...token, error: "RefreshAccessTokenError" };
  }

  return {
    ...token,
    accessToken: createAccessToken(refreshedSession.userId),
    userId: refreshedSession.userId,
    refreshToken: refreshedSession.token,
    refreshTokenExpires: refreshedSession.expiresAt,
    accessTokenExpires: Date.now() + SESSION_CONFIG.accessTokenDurationMs,
    error: undefined,
  };
}

export const authOptions: NextAuthOptions = {
  secret: appEnv.authSecret,
  session: {
    strategy: "jwt",
    maxAge: Math.floor(SESSION_CONFIG.refreshTokenDurationMs / 1000),
  },
  jwt: {
    maxAge: Math.floor(SESSION_CONFIG.refreshTokenDurationMs / 1000),
  },
  pages: {
    signIn: APP_ROUTES.login,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim() ?? "";
        const password = credentials?.password ?? "";

        if (!email || !password) {
          throw new Error(AUTH_VALIDATION.invalidCredentials);
        }

        const result = await authenticateUser({ email, password });

        if (!result.ok) {
          throw new Error(result.error);
        }

        return {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const appToken = token as AppToken;

      if (user) {
        const refreshSession = createRefreshSession(user.id);

        return {
          ...appToken,
          accessToken: createAccessToken(user.id),
          userId: user.id,
          name: user.name,
          email: user.email,
          refreshToken: refreshSession.token,
          refreshTokenExpires: refreshSession.expiresAt,
          accessTokenExpires: Date.now() + SESSION_CONFIG.accessTokenDurationMs,
          error: undefined,
        };
      }

      if (
        appToken.accessTokenExpires &&
        Date.now() < appToken.accessTokenExpires
      ) {
        if (!appToken.accessToken && appToken.userId) {
          return {
            ...appToken,
            accessToken: createAccessToken(appToken.userId),
          };
        }

        return appToken;
      }

      return refreshAccessToken(appToken);
    },
    async session({ session, token }) {
      const appToken = token as AppToken;

      if (!appToken.userId) {
        return {
          ...session,
          error: "RefreshAccessTokenError" as const,
        };
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: appToken.userId,
          name: appToken.name ?? session.user?.name ?? "",
          email: appToken.email ?? session.user?.email ?? "",
        },
        accessToken: appToken.accessToken ?? null,
        accessTokenExpires: appToken.accessTokenExpires ?? null,
        refreshToken: appToken.refreshToken ?? null,
        refreshTokenExpires: appToken.refreshTokenExpires ?? null,
        error: appToken.error,
      };
    },
  },
  events: {
    async signOut(message) {
      revokeRefreshSession((message.token as AppToken).refreshToken);
    },
  },
};
