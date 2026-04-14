import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string | null;
    accessTokenExpires: number | null;
    error?: "RefreshAccessTokenError";
    refreshToken: string | null;
    refreshTokenExpires: number | null;
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    accessTokenExpires?: number;
    error?: "RefreshAccessTokenError";
    refreshToken?: string;
    refreshTokenExpires?: number;
    userId?: string;
  }
}
