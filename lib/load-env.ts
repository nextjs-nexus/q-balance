// Loads .env.local and .env for command-line scripts. Next.js does this itself for the app.
// Variables already set in the environment, such as on the host, take precedence.
import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"], quiet: true });
