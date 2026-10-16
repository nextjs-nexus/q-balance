import assert from "node:assert/strict";
import test from "node:test";
import { auth } from "../lib/auth";
import { PASSWORD_REQUIREMENTS } from "../lib/password-policy";

test("auth rejects weak passwords on every password creation endpoint", async () => {
  const requests = [
    () => auth.api.signUpEmail({ body: { name: "Test", email: "test@example.com", password: "abcdefghij" } }),
    () => auth.api.resetPassword({ body: { token: "invalid", newPassword: "abcdefghij" } }),
    () => auth.api.changePassword({ body: { currentPassword: "old", newPassword: "abcdefghij" } }),
  ];

  for (const request of requests) {
    await assert.rejects(request, (error: unknown) => {
      const result = error as { status?: string; body?: { code?: string; message?: string } };
      assert.equal(result.status, "BAD_REQUEST");
      assert.equal(result.body?.code, "INVALID_PASSWORD");
      assert.equal(result.body?.message, PASSWORD_REQUIREMENTS);
      return true;
    });
  }
});
