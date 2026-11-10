import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "./auth";
import { ensureFreshSampleAccount } from "./demo-account";
import { getDemoConfig, isDemoEmail } from "./demo";

// What the interface needs to know about the current visitor. Safe to pass to Client Components.
export type Viewer = {
  signedIn: boolean;
  isDemo: boolean;
  demoAvailable: boolean;
  name: string | null;
};

export class LoginRequiredError extends Error {
  constructor() {
    super("You must be logged in to change data.");
    this.name = "LoginRequiredError";
  }
}

// One session lookup per request, shared by layouts, pages, data helpers, and Server Actions.
export const getSessionUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
});

export const getViewer = cache(async (): Promise<Viewer> => {
  const user = await getSessionUser();

  return {
    signedIn: Boolean(user),
    isDemo: Boolean(user && isDemoEmail(user.email)),
    demoAvailable: getDemoConfig() !== null,
    name: user?.name ?? null,
  };
});

/**
 * The user whose data is shown: the signed-in user, or the read-only showcase account for guests.
 * Sample data is refreshed here once a day, so no scheduled job is required.
 */
export const getDataOwnerId = cache(async (): Promise<string> => {
  const user = await getSessionUser();

  if (!user) {
    return ensureFreshSampleAccount("showcase");
  }

  if (isDemoEmail(user.email)) {
    await ensureFreshSampleAccount("demo");
  }

  return user.id;
});

// The user allowed to change data. Guests are refused, so the showcase data can never change.
export async function requireWriterId(): Promise<string> {
  const user = await getSessionUser();

  if (!user) {
    throw new LoginRequiredError();
  }

  return user.id;
}

// For pages that only make sense for a signed-in user, such as changing the password.
export async function getCurrentUserId(): Promise<string> {
  const user = await getSessionUser();

  if (!user) {
    redirect("/signin");
  }

  return user.id;
}
