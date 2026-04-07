import { redirect } from "next/navigation";

import { loginAction } from "@/features/auth/actions";
import { AuthForm } from "@/features/auth/components/auth-form";
import { getSessionUser } from "@/server/auth/session";

export default async function LoginPage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#dbeafe_0%,#eff6ff_35%,#f8fafc_65%,#ffffff_100%)] px-6 py-12">
      <AuthForm action={loginAction} mode="login" />
    </main>
  );
}
