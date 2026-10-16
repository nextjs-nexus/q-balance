import { Input } from "./input";
import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_REQUIREMENTS } from "../lib/password-policy";

export default function PasswordFields({ confirm = false }: { confirm?: boolean }) {
  return (
    <>
      <label htmlFor="password">{confirm ? "New password" : "Password"}</label>
      <Input
        id="password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={PASSWORD_MIN_LENGTH}
        maxLength={PASSWORD_MAX_LENGTH}
        aria-describedby="password-requirements"
        required
      />
      <p id="password-requirements" className="text-sm text-slate-600">{PASSWORD_REQUIREMENTS}</p>
      {confirm && (
        <>
          <label htmlFor="confirmPassword">Confirm password</label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={PASSWORD_MIN_LENGTH}
            maxLength={PASSWORD_MAX_LENGTH}
            required
          />
        </>
      )}
    </>
  );
}
