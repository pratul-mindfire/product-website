export const DASHBOARD_NAV_ITEMS = [
  "Overview",
  "Orders",
  "Products",
  "Customers",
  "Analytics",
] as const;

export const DASHBOARD_TEXT = {
  brand: "Product Hub",
  title: "Home",
  subtitle: "Your account is active and ready to use.",
  logout: "Logout",
  badge: "Auth Enabled",
  welcomePrefix: "Welcome back,",
  heroDescription:
    "Register, login, and logout are now connected. This homepage is protected by a server-side session cookie, and the logout button lives in the left sidebar as requested.",
  cards: {
    session: {
      label: "Session",
      value: "Active",
      description: "Access to this screen requires a valid signed cookie.",
    },
    email: {
      label: "User Email",
      description: "Loaded from your MongoDB users collection.",
    },
    nextStep: {
      label: "Next Step",
      value: "Ready",
      description: "Auth is now set up to use MongoDB as the database layer.",
    },
  },
} as const;
