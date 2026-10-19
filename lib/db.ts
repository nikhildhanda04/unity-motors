import "server-only";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "./generated/prisma/client";

/**
 * Prisma 7 has no Rust engine — it talks to Neon through a driver adapter.
 * The adapter is given the POOLED connection string (host contains "-pooler"),
 * which is what serverless needs: Neon's pooler holds the real connections so
 * short-lived lambdas don't exhaust the database.
 */
function create() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon pooled connection string.",
    );
  }
  return new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
}

// Dev hot-reload re-evaluates modules; without this each reload would open a
// fresh pool and eventually exhaust Neon's connection limit.
const g = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = g.prisma ?? create();

if (process.env.NODE_ENV !== "production") g.prisma = prisma;
