import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { APP_ROUTES } from "@/constants/app";
import { AUTH_FORM_MODES, AUTH_FORM_TEXT } from "@/constants/auth";
import { AuthForm } from "@/app/features/auth/components/auth-form";
import { authOptions } from "@/server/auth/options";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user && !session.error) {
    redirect(APP_ROUTES.dashboard);
  }

  return (
    <main className={AUTH_FORM_TEXT.login.backgroundClass}>
      <AuthForm mode={AUTH_FORM_MODES.login} />
    </main>
  );
}
