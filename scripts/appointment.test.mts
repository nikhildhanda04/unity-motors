/**
 * Exercises the REAL appointmentLink from lib/whatsapp.ts — not a copy of it.
 * A test that re-implements the logic cannot catch a bug in the logic.
 *
 *   npx tsx scripts/appointment.test.mts
 */
import assert from "node:assert/strict";

process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "919215593793";

const { appointmentLink, enquiryNumberDisplay } = await import(
  "../lib/whatsapp.js"
);

const decode = (link: string) =>
  new URL(link).searchParams.get("text") as string;

// --- a full submission -----------------------------------------------------
const full = appointmentLink({
  name: "Jay Sharma",
  phone: "+91 98765 43210",
  email: "jay@email.com",
  vehicle: "Honda City",
  notes: "Full detail & ceramic coating.\nPaint has swirl marks.",
});

assert.ok(full.startsWith("https://wa.me/919215593793?text="), "wa.me target");
const t = decode(full);
assert.ok(t.includes("Name: Jay Sharma"));
assert.ok(t.includes("Phone: +91 98765 43210"));
assert.ok(t.includes("Email: jay@email.com"));
assert.ok(t.includes("Vehicle: Honda City"));
assert.ok(t.includes("Paint has swirl marks."), "multi-line notes survive");
assert.ok(t.includes("&"), "ampersand survives encoding");
assert.ok(full.includes("%0A"), "line breaks encode as %0A");

// --- only the required fields ---------------------------------------------
const bare = decode(appointmentLink({ name: "A Singh", phone: "9876543210" }));
assert.ok(bare.includes("Name: A Singh"));
assert.ok(!bare.includes("Email:"), "empty optional fields are dropped");
assert.ok(!bare.includes("Vehicle:"), "empty optional fields are dropped");
assert.ok(!bare.includes("What I need:"), "empty notes dropped");

// Whitespace-only input must count as absent, not as an empty labelled line.
const blank = decode(
  appointmentLink({ name: "B", phone: "1", email: "   ", vehicle: "\t" }),
);
assert.ok(!blank.includes("Email:"), "whitespace-only email dropped");
assert.ok(!blank.includes("Vehicle:"), "whitespace-only vehicle dropped");

// --- display formatting ----------------------------------------------------
assert.equal(enquiryNumberDisplay(), "+91 92155 93793");

console.log("appointment: all assertions passed");
console.log("\ndecoded message:\n---\n" + t + "\n---");
