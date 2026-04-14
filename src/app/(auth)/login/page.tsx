import { redirect } from "next/navigation";

import { APP_ROUTES } from "@/constants/app";
import { AUTH_FORM_MODES, AUTH_FORM_TEXT } from "@/constants/auth";
import { loginAction } from "@/app/features/auth/actions";
import { AuthForm } from "@/app/features/auth/components/auth-form";
import { getSessionUser } from "@/server/auth/session";

export default async function LoginPage() {
  const user = await getSessionUser();

  if (user) {
    redirect(APP_ROUTES.dashboard);
  }

  return (
    <main className={AUTH_FORM_TEXT.login.backgroundClass}>
      <AuthForm action={loginAction} mode={AUTH_FORM_MODES.login} />
    </main>
  );
}
