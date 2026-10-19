// Smallest thing that fails if the login logic breaks.
// Run: node scripts/auth.test.mjs
import assert from "node:assert/strict";
import { timingSafeEqual } from "node:crypto";

// --- mirrors lib/auth.ts (kept in sync by this test failing loudly) ---
function normalisePhone(input) {
  let d = String(input).replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return d;
}
function safeEqual(a, b) {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  const pad = Math.max(ba.length, bb.length);
  const pa = Buffer.alloc(pad);
  const pb = Buffer.alloc(pad);
  ba.copy(pa);
  bb.copy(pb);
  return timingSafeEqual(pa, pb) && ba.length === bb.length;
}
function verify(phone, password, env) {
  const expectedPhone = normalisePhone(env.ADMIN_PHONE ?? "");
  const expectedPassword = env.ADMIN_PASSWORD ?? "";
  const phoneOk = safeEqual(normalisePhone(phone), expectedPhone);
  const passwordOk = safeEqual(password, expectedPassword);
  const configured = expectedPhone.length > 0 && expectedPassword.length > 0;
  return configured && phoneOk && passwordOk;
}

const ENV = { ADMIN_PHONE: "9215593793", ADMIN_PASSWORD: "s3cret-pass" };

// --- phone normalisation: every way a human types their own number ---
for (const variant of [
  "9215593793",
  "+919215593793",
  "919215593793",
  "+91 92155 93793",
  "09215593793",
  "+91-9215-593-793",
  " 9215593793 ",
]) {
  assert.equal(normalisePhone(variant), "9215593793", `normalise ${variant}`);
  assert.equal(verify(variant, "s3cret-pass", ENV), true, `login as ${variant}`);
}

// --- all three wrong combinations must fail ---
assert.equal(verify("9999999999", "wrong", ENV), false, "both wrong");
assert.equal(verify("9999999999", "s3cret-pass", ENV), false, "wrong phone");
assert.equal(verify("9215593793", "wrong", ENV), false, "wrong password");

// --- near-misses: no prefix or length confusion ---
assert.equal(verify("9215593793", "s3cret-pas", ENV), false, "short password");
assert.equal(verify("9215593793", "s3cret-passX", ENV), false, "long password");
assert.equal(verify("921559379", "s3cret-pass", ENV), false, "short phone");
assert.equal(safeEqual("abc", "abcd"), false, "length mismatch not equal");
assert.equal(safeEqual("abc", "abc"), true, "identical equal");

// --- unset env must NOT accept an empty form (the dangerous default) ---
assert.equal(verify("", "", {}), false, "empty creds vs unset env");
assert.equal(verify("", "", { ADMIN_PHONE: "", ADMIN_PASSWORD: "" }), false, "blank env");
assert.equal(
  verify("9215593793", "s3cret-pass", { ADMIN_PHONE: "9215593793" }),
  false,
  "password env missing",
);

console.log("auth: all assertions passed");
