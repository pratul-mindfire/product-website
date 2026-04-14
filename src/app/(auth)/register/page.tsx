import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { APP_ROUTES } from "@/constants/app";
import { AUTH_FORM_MODES, AUTH_FORM_TEXT } from "@/constants/auth";
import { registerAction } from "@/app/features/auth/actions";
import { AuthForm } from "@/app/features/auth/components/auth-form";
import { authOptions } from "@/server/auth/options";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session?.user && !session.error) {
    redirect(APP_ROUTES.dashboard);
  }

  return (
    <main className={AUTH_FORM_TEXT.register.backgroundClass}>
      <AuthForm registerAction={registerAction} mode={AUTH_FORM_MODES.register} />
    </main>
  );
}
