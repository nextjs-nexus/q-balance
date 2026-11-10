// Demo and showcase account settings. No server dependencies, so it can be tested directly.

export type DemoConfig = {
  email: string;
  password: string;
};

type Environment = Record<string, string | undefined>;

// Guests browse this account's data. It has no password, so nobody can sign in as it or change it.
export const SHOWCASE_EMAIL = "showcase@q-balance.invalid";
export const SHOWCASE_USER_NAME = "Q-Balance Showcase";
export const DEMO_USER_NAME = "Demo Visitor";

export const LOGIN_REQUIRED_MESSAGE =
  "Adding, editing, and deleting categories, items, and transactions is available after you log in.";

// Account endpoints a demo visitor must not use, because the demo account is shared.
export const DEMO_SESSION_RESTRICTED_PATHS = [
  "/change-email",
  "/change-password",
  "/delete-user",
  "/list-sessions",
  "/revoke-other-sessions",
  "/revoke-session",
  "/revoke-sessions",
  "/set-password",
  "/update-user",
];

// Endpoints that receive an email address in the request body.
export const DEMO_EMAIL_RESTRICTED_PATHS = [
  "/request-password-reset",
  "/send-verification-email",
  "/sign-up/email",
];

function normalizeEmail(email: unknown): string | null {
  return typeof email === "string" ? email.trim().toLowerCase() : null;
}

export function getDemoConfig(env: Environment = process.env): DemoConfig | null {
  const email = normalizeEmail(env.DEMO_USER_EMAIL);
  const password = env.DEMO_USER_PASSWORD;

  if (!email || !password) {
    return null;
  }

  return { email, password };
}

export function isDemoEmail(email: unknown, env: Environment = process.env): boolean {
  const config = getDemoConfig(env);

  return Boolean(config && normalizeEmail(email) === config.email);
}

// The demo and showcase accounts are shared, so their email addresses are protected.
export function isProtectedEmail(email: unknown, env: Environment = process.env): boolean {
  return normalizeEmail(email) === SHOWCASE_EMAIL || isDemoEmail(email, env);
}

// Only same-site paths are allowed after the demo sign-in, so it cannot redirect elsewhere.
export function getSafeRedirectPath(value: unknown, fallback = "/dashboard"): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }

  return value;
}
