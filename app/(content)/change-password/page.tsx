import Link from "next/link";
import { Input } from "../../../components/input";
import { changePasswordAction } from "../../../actions/auth";
import AuthFeedback, { type AuthParams } from "../../../components/auth-feedback";
import PasswordFields from "../../../components/password-fields";
import { getCurrentUserId, getViewer } from "../../../lib/current-user";

export default async function Page({ searchParams }: { searchParams: Promise<AuthParams> }) {
  const params = await searchParams;
  await getCurrentUserId();
  const viewer = await getViewer();

  if (viewer.isDemo) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 py-10 text-center">
        <h1 className="text-2xl font-bold">Change password</h1>
        <p className="max-w-sm text-balance-muted">
          The shared demo account&apos;s password cannot be changed. Create your own free account to manage a password.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-balance-primary">
          <Link href="/dashboard">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="form-control flex min-h-dvh flex-col items-center justify-center gap-4 px-4 py-10">
      <h1 className="text-2xl font-bold">Change password</h1>
      <form action={changePasswordAction} className="flex w-full max-w-sm flex-col gap-3">
        <AuthFeedback params={params} />
        <label htmlFor="currentPassword">Current password</label>
        <Input id="currentPassword" type="password" name="currentPassword" autoComplete="current-password" required />
        <PasswordFields confirm={true} />
        <button className="py-2" type="submit">Change password</button>
      </form>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-balance-primary">
        <Link href="/dashboard">Back to dashboard</Link>
      </div>
    </div>
  );
}
