"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import { isValidPassword, PASSWORD_REQUIREMENTS } from "../lib/password-policy";

function fail(path: string, message: string): never {
  redirect(`${path}${path.includes("?") ? "&" : "?"}error=${encodeURIComponent(message)}`);
}

export async function signUpAction(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (!isValidPassword(password)) fail("/signup", PASSWORD_REQUIREMENTS);
  try {
    await auth.api.signUpEmail({ body: {
      email: String(formData.get("email") || "").trim(),
      name: String(formData.get("name") || "").trim(),
      password,
      callbackURL: "/signin?verified=1",
    } });
  } catch {
    fail("/signup", "Unable to create your account. Check your details or request a verification email if you already registered.");
  }
  redirect("/verify-email");
}

export async function signInAction(formData: FormData) {
  try {
    await auth.api.signInEmail({ body: {
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || ""),
    } });
  } catch (error) {
    fail("/signin", error instanceof APIError && error.body?.code === "EMAIL_NOT_VERIFIED"
      ? "Verify your email before signing in. Check your inbox or request another verification email."
      : "Unable to sign in. Check your email and password and try again.");
  }
  redirect("/");
}

export async function sendVerificationAction(formData: FormData) {
  try {
    await auth.api.sendVerificationEmail({ body: {
      email: String(formData.get("email") || "").trim(),
      callbackURL: "/signin?verified=1",
    } });
  } catch {
    fail("/verify-email", "Unable to send the email. Please try again later.");
  }
  redirect("/verify-email?sent=1");
}

export async function requestPasswordResetAction(formData: FormData) {
  try {
    await auth.api.requestPasswordReset({ body: {
      email: String(formData.get("email") || "").trim(),
      redirectTo: "/reset-password",
    } });
  } catch {
    fail("/forgot-password", "Unable to send the email. Please try again later.");
  }
  redirect("/forgot-password?sent=1");
}

export async function resetPasswordAction(formData: FormData) {
  const token = String(formData.get("token") || "");
  const path = `/reset-password?token=${encodeURIComponent(token)}`;
  const newPassword = String(formData.get("password") || "");
  if (!isValidPassword(newPassword)) fail(path, PASSWORD_REQUIREMENTS);
  if (newPassword !== formData.get("confirmPassword")) fail(path, "Passwords do not match.");
  try {
    await auth.api.resetPassword({ body: { token, newPassword } });
  } catch {
    fail(path, "Unable to reset your password. Request a new reset link.");
  }
  redirect("/signin?reset=1");
}

export async function changePasswordAction(formData: FormData) {
  const newPassword = String(formData.get("password") || "");
  if (!isValidPassword(newPassword)) fail("/change-password", PASSWORD_REQUIREMENTS);
  if (newPassword !== formData.get("confirmPassword")) fail("/change-password", "Passwords do not match.");
  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: String(formData.get("currentPassword") || ""),
        newPassword,
        revokeOtherSessions: true,
      },
    });
  } catch {
    fail("/change-password", "Unable to change your password. Check your current password and try again.");
  }
  redirect("/change-password?changed=1");
}

export async function signOutAction() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/");
}
