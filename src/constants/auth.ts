import { APP_ROUTES } from "@/constants/app";

export const AUTH_FORM_FIELDS = {
  name: "name",
  email: "email",
  password: "password",
} as const;

export const AUTH_FORM_MODES = {
  login: "login",
  register: "register",
} as const;

export const AUTH_FORM_TEXT = {
  brand: "Product Website",
  submitPending: "Please wait...",
  labels: {
    name: "Full name",
    email: "Email",
    password: "Password",
  },
  placeholders: {
    name: "Alex Morgan",
    email: "you@example.com",
    password: "Minimum 6 characters",
  },
  login: {
    title: "Welcome back",
    description: "Log in to continue to the home page.",
    submit: "Log in",
    footerPrompt: "Need an account?",
    footerCta: "Register",
    footerHref: APP_ROUTES.register,
    backgroundClass:
      "flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#dbeafe_0%,#eff6ff_35%,#f8fafc_65%,#ffffff_100%)] px-6 py-12",
  },
  register: {
    title: "Create your account",
    description: "Register to access your product dashboard.",
    submit: "Create account",
    footerPrompt: "Already have an account?",
    footerCta: "Log in",
    footerHref: APP_ROUTES.login,
    backgroundClass:
      "flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#fef3c7_0%,#fff7ed_30%,#f8fafc_70%,#ffffff_100%)] px-6 py-12",
  },
} as const;

export const AUTH_VALIDATION = {
  minNameLength: 2,
  minPasswordLength: 6,
  invalidName: "Name must be at least 2 characters.",
  invalidEmail: "Enter a valid email address.",
  invalidPassword: "Password must be at least 6 characters.",
  duplicateEmail: "An account with this email already exists.",
  invalidCredentials: "Invalid email or password.",
} as const;
