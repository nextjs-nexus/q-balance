export type AuthParams = {
  error?: string;
  sent?: string;
  verified?: string;
  reset?: string;
  changed?: string;
  token?: string;
};

export default function AuthFeedback({ params }: { params: AuthParams }) {
  return (
    <>
      {params.error && <p role="alert" className="text-sm text-balance-error">{params.error}</p>}
      {params.sent && <p role="status" className="text-sm text-balance-income">If this account needs this email, a link has been sent. Check your inbox and spam folder.</p>}
      {params.verified && <p role="status" className="text-sm text-balance-income">Your email is verified. You can now sign in.</p>}
      {(params.reset || params.changed) && <p role="status" className="text-sm text-balance-income">Your password has been updated.</p>}
    </>
  );
}
