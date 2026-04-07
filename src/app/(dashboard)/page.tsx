import { redirect } from "next/navigation";

import { logoutAction } from "@/features/auth/actions";
import { getSessionUser } from "@/server/auth/session";

const navItems = ["Overview", "Orders", "Products", "Customers", "Analytics"];

export default async function Home() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#eff6ff_45%,#fff7ed_100%)] px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 shadow-[0_30px_120px_rgba(15,23,42,0.14)] backdrop-blur">
        <aside className="flex w-full max-w-[280px] flex-col justify-between border-b border-slate-200 bg-slate-950 px-6 py-8 text-slate-100 sm:border-b-0 sm:border-r">
          <div className="space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                Product Hub
              </p>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Home</h1>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Your account is active and ready to use.
                </p>
              </div>
            </div>

            <nav className="space-y-3">
              {navItems.map((item, index) => (
                <div
                  key={item}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    index === 0
                      ? "bg-white text-slate-950"
                      : "bg-slate-900 text-slate-300"
                  }`}
                >
                  {item}
                </div>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-4">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="mt-1 text-sm text-slate-400">{user.email}</p>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-2xl border border-slate-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950"
              >
                Logout
              </button>
            </form>
          </div>
        </aside>

        <section className="flex flex-1 flex-col justify-between px-6 py-8 sm:px-10 sm:py-10">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              Auth Enabled
            </span>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Welcome back, {user.name.split(" ")[0]}.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Register, login, and logout are now connected. This homepage is
              protected by a server-side session cookie, and the logout button
              lives in the left sidebar as requested.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <article className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-medium text-slate-500">Session</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">
                Active
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Access to this screen requires a valid signed cookie.
              </p>
            </article>
            <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
              <p className="text-sm font-medium text-slate-500">User Email</p>
              <p className="mt-3 break-all text-lg font-semibold text-slate-950">
                {user.email}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Loaded from your MongoDB users collection.
              </p>
            </article>
            <article className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#eff6ff_0%,#dbeafe_100%)] p-6">
              <p className="text-sm font-medium text-slate-500">Next Step</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">
                Ready
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Auth is now set up to use MongoDB as the database layer.
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
