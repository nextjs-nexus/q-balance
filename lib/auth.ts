import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { isValidPassword, PASSWORD_MIN_LENGTH, PASSWORD_REQUIREMENTS } from "./password-policy";
import { nextCookies } from "better-auth/next-js";
import { sendAuthEmail } from "./email";
import connectionPool from "../db";

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
