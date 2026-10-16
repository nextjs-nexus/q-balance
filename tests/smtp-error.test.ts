import assert from "node:assert/strict";
import test from "node:test";
import { getSmtpErrorDetails } from "../lib/smtp-error";

test("SMTP diagnostics retain failure codes without exposing recipients or credentials", () => {
  assert.deepEqual(getSmtpErrorDetails({
    code: "EAUTH",
    responseCode: 535,
    command: "AUTH PLAIN secret-credentials",
    message: "secret-password",
    response: "private server response",
  }), { code: "EAUTH", responseCode: 535, command: "AUTH" });

  assert.deepEqual(getSmtpErrorDetails({
    code: "EENVELOPE",
    responseCode: 550,
    command: "RCPT TO:<private@example.com>",
  }), { code: "EENVELOPE", responseCode: 550, command: "RCPT" });
});

test("SMTP diagnostics discard unexpected values and handle non-error throws", () => {
  for (const error of [null, "secret", { code: "secret", command: "secret", responseCode: "secret" }]) {
    assert.deepEqual(getSmtpErrorDetails(error), {
      code: "UNKNOWN",
      responseCode: undefined,
      command: undefined,
    });
  }
});
