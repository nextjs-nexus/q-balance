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
      {params.error && <p role="alert" className="text-sm text-red-700">{params.error}</p>}
      {params.sent && <p role="status" className="text-sm text-green-700">If this account needs this email, a link has been sent. Check your inbox and spam folder.</p>}
      {params.verified && <p role="status" className="text-sm text-green-700">Your email is verified. You can now sign in.</p>}
      {(params.reset || params.changed) && <p role="status" className="text-sm text-green-700">Your password has been updated.</p>}
    </>
  );
}
