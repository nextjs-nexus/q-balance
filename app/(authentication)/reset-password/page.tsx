import Link from "next/link";
import { resetPasswordAction } from "../../../actions/auth";
import AuthFeedback, { type AuthParams } from "../../../components/auth-feedback";
import PasswordFields from "../../../components/password-fields";

export default async function Page({ searchParams }: { searchParams: Promise<AuthParams> }) {
  const params = await searchParams;
  return (
    <div className="form-control flex min-h-dvh flex-col items-center justify-center gap-4 px-4 py-10">
      <h1 className="text-2xl font-bold">Choose a new password</h1>
      <form action={resetPasswordAction} className="flex w-full max-w-sm flex-col gap-3">
        <AuthFeedback params={params} />
        {!params.token && (
          <p role="alert" className="text-sm text-red-700">
            This reset link is missing or invalid. Request a new reset link below.
          </p>
        )}
        <PasswordFields confirm={true} />
        <input type="hidden" name="token" value={params.token || ""} />
        <button className="py-2 disabled:opacity-50" type="submit" disabled={!params.token}>Choose a new password</button>
      </form>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-700">
        <Link href="/signin">Back to sign in</Link>
        <Link href="/forgot-password">Request a new reset link</Link>
      </div>
    </div>
  );
}
