"use server";

import { redirect } from "next/navigation";

import { APP_ROUTES } from "@/constants/app";
import { AUTH_FORM_FIELDS } from "@/constants/auth";
import { authenticateUser, registerUser } from "@/server/auth/users";
import { createSession, deleteSession } from "@/server/auth/session";

export type AuthFormState = {
  error: string | null;
};

const initialState: AuthFormState = {
  error: null,
};

function readField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function registerAction(
  previousState: AuthFormState = initialState,
  formData: FormData,
): Promise<AuthFormState> {
  void previousState;
  const name = readField(formData, AUTH_FORM_FIELDS.name);
  const email = readField(formData, AUTH_FORM_FIELDS.email);
  const password = readField(formData, AUTH_FORM_FIELDS.password);

  const result = await registerUser({ name, email, password });

  if (!result.ok) {
    return { error: result.error };
  }

  await createSession(result.user.id);
  redirect(APP_ROUTES.home);
}

export async function loginAction(
  previousState: AuthFormState = initialState,
  formData: FormData,
): Promise<AuthFormState> {
  void previousState;
  const email = readField(formData, AUTH_FORM_FIELDS.email);
  const password = readField(formData, AUTH_FORM_FIELDS.password);

  const result = await authenticateUser({ email, password });

  if (!result.ok) {
    return { error: result.error };
  }

  await createSession(result.user.id);
  redirect(APP_ROUTES.home);
}

export async function logoutAction() {
  await deleteSession();
  redirect(APP_ROUTES.login);
}
