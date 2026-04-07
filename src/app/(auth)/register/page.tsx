import { redirect } from "next/navigation";

import { registerAction } from "@/features/auth/actions";
import { AuthForm } from "@/features/auth/components/auth-form";
import { getSessionUser } from "@/server/auth/session";

export default async function RegisterPage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#fef3c7_0%,#fff7ed_30%,#f8fafc_70%,#ffffff_100%)] px-6 py-12">
      <AuthForm action={registerAction} mode="register" />
    </main>
  );
}
