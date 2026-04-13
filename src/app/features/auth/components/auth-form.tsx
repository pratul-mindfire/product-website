"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { TextInput } from "@/app/components/ui/text-input";
import {
  AUTH_FORM_FIELDS,
  AUTH_FORM_MODES,
  AUTH_FORM_TEXT,
  AUTH_VALIDATION,
} from "@/constants/auth";
import type { AuthFormState } from "@/app/features/auth/actions";

type AuthFormProps = {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  mode: (typeof AUTH_FORM_MODES)[keyof typeof AUTH_FORM_MODES];
};

const initialState: AuthFormState = {
  error: null,
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="mt-2">
      {pending ? AUTH_FORM_TEXT.submitPending : label}
    </Button>
  );
}

export function AuthForm({ action, mode }: AuthFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const isRegister = mode === AUTH_FORM_MODES.register;
  const content = isRegister ? AUTH_FORM_TEXT.register : AUTH_FORM_TEXT.login;

  return (
    <Card className="w-full max-w-md bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
          {AUTH_FORM_TEXT.brand}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          {content.title}
        </h1>
        <p className="text-sm leading-6 text-slate-600">
          {content.description}
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        {isRegister ? (
          <TextInput
            type="text"
            name={AUTH_FORM_FIELDS.name}
            label={AUTH_FORM_TEXT.labels.name}
            required
            minLength={AUTH_VALIDATION.minNameLength}
            placeholder={AUTH_FORM_TEXT.placeholders.name}
          />
        ) : null}

        <TextInput
          type="email"
          name={AUTH_FORM_FIELDS.email}
          label={AUTH_FORM_TEXT.labels.email}
          required
          placeholder={AUTH_FORM_TEXT.placeholders.email}
        />

        <TextInput
          type="password"
          name={AUTH_FORM_FIELDS.password}
          label={AUTH_FORM_TEXT.labels.password}
          required
          minLength={AUTH_VALIDATION.minPasswordLength}
          placeholder={AUTH_FORM_TEXT.placeholders.password}
        />

        {state.error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {state.error}
          </p>
        ) : null}

        <SubmitButton label={content.submit} />
      </form>

      <p className="mt-6 text-sm text-slate-600">
        {content.footerPrompt}{" "}
        <Link
          href={content.footerHref}
          className="font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4"
        >
          {content.footerCta}
        </Link>
      </p>
    </Card>
  );
}
