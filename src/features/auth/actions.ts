"use server";

import { redirect } from "next/navigation";

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
  const name = readField(formData, "name");
  const email = readField(formData, "email");
  const password = readField(formData, "password");

  const result = await registerUser({ name, email, password });

  if (!result.ok) {
    return { error: result.error };
  }

  await createSession(result.user.id);
  redirect("/");
}

export async function loginAction(
  previousState: AuthFormState = initialState,
  formData: FormData,
): Promise<AuthFormState> {
  void previousState;
  const email = readField(formData, "email");
  const password = readField(formData, "password");

  const result = await authenticateUser({ email, password });

  if (!result.ok) {
    return { error: result.error };
  }

  await createSession(result.user.id);
  redirect("/");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
