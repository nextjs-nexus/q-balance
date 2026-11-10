import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware, getSessionFromCtx } from "better-auth/api";
import {
  DEMO_EMAIL_RESTRICTED_PATHS,
  DEMO_SESSION_RESTRICTED_PATHS,
  SHOWCASE_EMAIL,
  isDemoEmail,
  isProtectedEmail,
} from "./demo";
import { isValidPassword, PASSWORD_MIN_LENGTH, PASSWORD_REQUIREMENTS } from "./password-policy";
import { nextCookies } from "better-auth/next-js";
import { sendAuthEmail } from "./email";
import connectionPool from "../db";

const SAMPLE_ACCOUNT_RESTRICTED_MESSAGE = "The shared demo account cannot be changed.";

function restrictSampleAccount(): never {
  throw new APIError("FORBIDDEN", {
    code: "DEMO_ACCOUNT_RESTRICTED",
    message: SAMPLE_ACCOUNT_RESTRICTED_MESSAGE,
  });
}

export const auth = betterAuth({
  database: connectionPool,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: PASSWORD_MIN_LENGTH,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 3600,
    sendResetPassword: async ({ user, url }) => {
      await sendAuthEmail(user.email, url, "reset");
    },
  },
  emailVerification: {
    expiresIn: 3600,
    sendOnSignUp: true,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendAuthEmail(user.email, url, "verify");
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // The demo and showcase accounts are shared, so visitors may use them but not change or take them over.
      const email = (ctx.body as { email?: unknown } | undefined)?.email;

      if (DEMO_EMAIL_RESTRICTED_PATHS.includes(ctx.path) && isProtectedEmail(email)) {
        restrictSampleAccount();
      }

      if (ctx.path === "/sign-in/email" && String(email ?? "").trim().toLowerCase() === SHOWCASE_EMAIL) {
        restrictSampleAccount();
      }

      if (DEMO_SESSION_RESTRICTED_PATHS.includes(ctx.path)) {
        const session = await getSessionFromCtx(ctx);
        if (session && isDemoEmail(session.user.email)) {
          restrictSampleAccount();
        }
      }

      const passwordField = ctx.path === "/sign-up/email"
        ? "password"
        : ["/reset-password", "/change-password"].includes(ctx.path)
          ? "newPassword"
          : null;

      if (passwordField && !isValidPassword(ctx.body?.[passwordField])) {
        throw new APIError("BAD_REQUEST", {
          code: "INVALID_PASSWORD",
          message: PASSWORD_REQUIREMENTS,
        });
      }
    }),
  },
  plugins: [nextCookies()],
});
