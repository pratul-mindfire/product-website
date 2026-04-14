import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { SectionBadge } from "@/app/components/ui/section-badge";
import { APP_ROUTES } from "@/constants/app";
import { DASHBOARD_TEXT } from "@/constants/dashboard";
import { LogoutButton } from "@/app/features/auth/components/logout-button";
import { ProfileSummary } from "@/app/features/dashboard/components/profile-summary";
import { SidebarNav } from "@/app/features/dashboard/components/sidebar-nav";
import { authOptions } from "@/server/auth/options";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.error || !session.user) {
    redirect(APP_ROUTES.login);
  }

  const user = session.user;

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#eff6ff_45%,#fff7ed_100%)] px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 shadow-[0_30px_120px_rgba(15,23,42,0.14)] backdrop-blur">
        <aside className="flex w-full max-w-[280px] flex-col justify-between border-b border-slate-200 bg-slate-950 px-6 py-8 text-slate-100 sm:border-b-0 sm:border-r">
          <div className="space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                {DASHBOARD_TEXT.brand}
              </p>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  {DASHBOARD_TEXT.title}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {DASHBOARD_TEXT.subtitle}
                </p>
              </div>
            </div>

            <SidebarNav items={DASHBOARD_TEXT.navItems} />
          </div>

          <div className="space-y-4">
            <ProfileSummary email={user.email} name={user.name} />

            <LogoutButton>{DASHBOARD_TEXT.logout}</LogoutButton>
          </div>
        </aside>

        <section className="flex flex-1 flex-col justify-between px-6 py-8 sm:px-10 sm:py-10">
          <div className="max-w-3xl">
            <SectionBadge>{DASHBOARD_TEXT.badge}</SectionBadge>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {DASHBOARD_TEXT.welcomePrefix} {user.name.split(" ")[0]}.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {DASHBOARD_TEXT.heroDescription}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
