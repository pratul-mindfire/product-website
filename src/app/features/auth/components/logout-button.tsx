"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/app/components/ui/button";
import { APP_ROUTES } from "@/constants/app";

type LogoutButtonProps = {
  children: React.ReactNode;
};

export function LogoutButton({ children }: LogoutButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      width="full"
      onClick={() => void signOut({ callbackUrl: APP_ROUTES.login })}
    >
      {children}
    </Button>
  );
}
