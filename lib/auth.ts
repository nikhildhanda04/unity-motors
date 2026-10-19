import "server-only";
import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "um_admin";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

/**
 * "+91 92155 93793", "09215593793", "919215593793" -> "9215593793".
 * Nobody should fail a login because of how they typed their own number.
 */
export function normalisePhone(input: string): string {
  let d = input.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return d;
}

/** Length-independent constant-time compare. */
function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  // timingSafeEqual throws on length mismatch, which would itself leak length.
  // Compare fixed-width digests of equal size instead.
  const pad = Math.max(ba.length, bb.length);
  const pa = Buffer.alloc(pad);
  const pb = Buffer.alloc(pad);
  ba.copy(pa);
  bb.copy(pb);
  return timingSafeEqual(pa, pb) && ba.length === bb.length;
}

/**
 * Verifies phone AND password. Deliberately evaluates both comparisons even
 * when the phone is already wrong: short-circuiting would let an attacker
 * discover valid numbers from response timing.
 */
export function verifyCredentials(phone: string, password: string): boolean {
  const expectedPhone = normalisePhone(process.env.ADMIN_PHONE ?? "");
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";

  const phoneOk = safeEqual(normalisePhone(phone), expectedPhone);
  const passwordOk = safeEqual(password, expectedPassword);

  // Refuse to authenticate against unset env vars, which would otherwise make
  // an empty form a valid login.
  const configured = expectedPhone.length > 0 && expectedPassword.length > 0;

  return configured && phoneOk && passwordOk;
}

export async function startSession() {
  (await cookies()).set(SESSION_COOKIE, process.env.ADMIN_TOKEN!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Server-side gate for route handlers and server actions. */
export async function isAuthed(): Promise<boolean> {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;
  return (await cookies()).get(SESSION_COOKIE)?.value === token;
}
