import Link from "next/link";
import { Input } from "../../../components/input";
import { sendVerificationAction } from "../../../actions/auth";
import AuthFeedback, { type AuthParams } from "../../../components/auth-feedback";

export default async function Page({ searchParams }: { searchParams: Promise<AuthParams> }) {
  const params = await searchParams;
  return (
    <div className="form-control flex min-h-dvh flex-col items-center justify-center gap-4 px-4 py-10">
      <h1 className="text-2xl font-bold">Verify your email</h1>
      <form action={sendVerificationAction} className="flex w-full max-w-sm flex-col gap-3">
        <AuthFeedback params={params} />
        <p>Check your inbox for a verification link, or request another below.</p>
        <label htmlFor="email">Email</label>
        <Input id="email" type="email" name="email" autoComplete="email" required />
        <button className="py-2" type="submit">Send verification email</button>
      </form>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-balance-primary">
        <Link href="/signin">Back to sign in</Link>
      </div>
    </div>
  );
}
