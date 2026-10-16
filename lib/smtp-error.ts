const smtpErrorCodes = new Set([
  "EAUTH", "ECONNECTION", "ECONNREFUSED", "ECONNRESET", "EDNS",
  "EENVELOPE", "EMESSAGE", "ENOTFOUND", "ESOCKET", "ETIMEDOUT",
  "ETLS", "EPROTOCOL",
]);

export function getSmtpErrorDetails(error: unknown) {
  const details = error && typeof error === "object"
    ? error as { code?: unknown; responseCode?: unknown; command?: unknown }
    : {};
  const command = typeof details.command === "string" ? details.command.split(" ")[0] : "";

  return {
    code: typeof details.code === "string" && smtpErrorCodes.has(details.code)
      ? details.code
      : "UNKNOWN",
    responseCode: typeof details.responseCode === "number"
      && Number.isInteger(details.responseCode)
      && details.responseCode >= 400 && details.responseCode <= 599
      ? details.responseCode
      : undefined,
    command: ["CONN", "EHLO", "HELO", "STARTTLS", "AUTH", "MAIL", "RCPT", "DATA"].includes(command)
      ? command
      : undefined,
  };
}
