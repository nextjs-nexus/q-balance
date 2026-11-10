'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import DemoSignInButton from './demo-sign-in-button';
import type { FormState } from '../lib/form-state';

// Shows validation errors, or a login notice when a guest tries to save.
// Render it outside the data form: the demo button is a form of its own.
export default function FormFeedback({ state }: { state: FormState }) {
  const pathname = usePathname();

  if (state.loginRequired) {
    return (
      <div role="status" className="mt-4 rounded-md border border-balance-border bg-balance-soft p-4 text-sm text-balance-ink">
        <p className="font-semibold">You are browsing sample data.</p>
        <p className="mt-1 text-balance-muted">
          {state.errors?.[0]} Nothing was saved.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/signin" className="font-medium text-balance-primary underline underline-offset-4">
            Log in
          </Link>
          <Link href="/signup" className="font-medium text-balance-primary underline underline-offset-4">
            Sign up free
          </Link>
          {state.demoAvailable && (
            <DemoSignInButton next={pathname} variant="link" label="Try the demo account" />
          )}
        </div>
      </div>
    );
  }

  if (!state.errors || state.errors.length === 0) {
    return null;
  }

  return (
    <ul role="alert" className="form-errors">
      {state.errors.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  );
}
