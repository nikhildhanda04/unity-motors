// Next.js reads .env.local; the Prisma CLI does not. Load it explicitly so
// `prisma generate` / `db push` / `studio` see the same DATABASE_URL the app does.
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  // Used by the CLI (migrate / db push / studio) only. The running app
  // connects through the Neon driver adapter in lib/db.ts instead.
  datasource: { url: env("DATABASE_URL") },
});
