import "./load-env";

import connectionPool from "../db";
import { getDemoConfig } from "./demo";
import { resetSampleAccount } from "./demo-account";

// Regenerates the showcase data and, when configured, the demo account's data.
async function resetDemo() {
  await resetSampleAccount("showcase", true);
  console.log("Showcase data reset.");

  if (getDemoConfig()) {
    await resetSampleAccount("demo", true);
    console.log("Demo account reset.");
  } else {
    console.log("DEMO_USER_EMAIL and DEMO_USER_PASSWORD are not set, so the demo account was skipped.");
  }
}

resetDemo()
  .catch((error: unknown) => {
    console.error("Demo reset failed:", error);
    process.exitCode = 1;
  })
  .finally(() => connectionPool.end());
