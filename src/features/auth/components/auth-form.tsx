"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { AuthFormState } from "@/features/auth/actions";

type AuthFormProps = {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  mode: "login" | "register";
};

const initialState: AuthFormState = {
  error: null,
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {pending ? "Please wait..." : label}
    </button>
  );
}

export function AuthForm({ action, mode }: AuthFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const isRegister = mode === "register";

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
          Product Website
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          {isRegister ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-sm leading-6 text-slate-600">
          {isRegister
            ? "Register to access your product dashboard."
            : "Log in to continue to the home page."}
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        {isRegister ? (
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Full name
            </span>
            <input
              type="text"
              name="name"
              required
              minLength={2}
              placeholder="Alex Morgan"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
            />
          </label>
        ) : null}

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            placeholder="Minimum 6 characters"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </label>

        {state.error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {state.error}
          </p>
        ) : null}

        <SubmitButton label={isRegister ? "Create account" : "Log in"} />
      </form>

      <p className="mt-6 text-sm text-slate-600">
        {isRegister ? "Already have an account?" : "Need an account?"}{" "}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4"
        >
          {isRegister ? "Log in" : "Register"}
        </Link>
      </p>
    </div>
  );
}
