import Link from "next/link";
import { Input } from "../../../components/input";
import { signInAction } from "../../../actions/auth";
import AuthFeedback, { type AuthParams } from "../../../components/auth-feedback";
import { PASSWORD_REQUIREMENTS } from "../../../lib/password-policy";
import { getDemoConfig } from "../../../lib/demo";
import DemoSignInButton from "../../../components/demo-sign-in-button";

export default async function Page({ searchParams }: { searchParams: Promise<AuthParams> }) {
  const params = await searchParams;
  const demoAvailable = getDemoConfig() !== null;
  return (
    <div className="form-control flex min-h-dvh flex-col items-center justify-center gap-4 px-4 py-10">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <form action={signInAction} className="flex w-full max-w-sm flex-col gap-3">
        <AuthFeedback params={params} />
        <label htmlFor="email">Email</label>
        <Input id="email" type="email" name="email" autoComplete="email" required />
        <label htmlFor="password">Password</label>
        <Input id="password" type="password" name="password" autoComplete="current-password" required />
        <p className="text-sm text-balance-muted">{PASSWORD_REQUIREMENTS}</p>
        <button className="py-2" type="submit">Sign In</button>
      </form>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-balance-primary">
        <Link href="/forgot-password">Forgot password?</Link>
        <Link href="/verify-email">Verify email</Link>
        <Link href="/signup">Create an account</Link>
      </div>
      <section aria-labelledby="demo-title" className="mt-4 w-full max-w-sm rounded-md border border-balance-border bg-balance-soft p-4 text-sm">
        <p className="text-balance-muted">Just looking around? No sign-up needed.</p>
        <h2 id="demo-title" className="mt-1 text-base font-semibold text-balance-ink">Browse or try the demo</h2>
        <p className="mt-1 text-balance-muted">
          Browse sample data without an account, or use the shared demo account to try adding and editing. Demo changes reset every day.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {demoAvailable && (
            <DemoSignInButton variant="secondary" label="Try the demo account" />
          )}
          <Link href="/dashboard" className="text-center font-medium text-balance-primary underline underline-offset-4">
            Keep browsing without an account
          </Link>
        </div>
      </section>
    </div>
  );
}
