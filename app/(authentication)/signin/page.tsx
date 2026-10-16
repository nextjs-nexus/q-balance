import Link from "next/link";
import { Input } from "../../../components/input";
import { signInAction } from "../../../actions/auth";
import AuthFeedback, { type AuthParams } from "../../../components/auth-feedback";
import { PASSWORD_REQUIREMENTS } from "../../../lib/password-policy";

export default async function Page({ searchParams }: { searchParams: Promise<AuthParams> }) {
  const params = await searchParams;
  return (
    <div className="form-control flex min-h-dvh flex-col items-center justify-center gap-4 px-4 py-10">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <form action={signInAction} className="flex w-full max-w-sm flex-col gap-3">
        <AuthFeedback params={params} />
        <label htmlFor="email">Email</label>
        <Input id="email" type="email" name="email" autoComplete="email" required />
        <label htmlFor="password">Password</label>
        <Input id="password" type="password" name="password" autoComplete="current-password" required />
        <p className="text-sm text-slate-600">{PASSWORD_REQUIREMENTS}</p>
        <button className="py-2" type="submit">Sign In</button>
      </form>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-700">
        <Link href="/forgot-password">Forgot password?</Link>
        <Link href="/verify-email">Verify email</Link>
        <Link href="/signup">Create an account</Link>
      </div>
    </div>
  );
}
