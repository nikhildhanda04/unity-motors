// Cart arithmetic and the WhatsApp handoff. Pure functions only — the React
// wrapper around them has nothing to get wrong that these do not cover.
import assert from "node:assert/strict";
import {
  MAX_QTY,
  addLine,
  cartTotal,
  lineKey,
  loadCart,
  removeLine,
  setQty,
  type CartLine,
} from "../lib/cart";
import { cartEnquiryLink } from "../lib/whatsapp";

const tips = (qty = 1): CartLine => ({
  slug: "titanium-exhaust-tips",
  title: "Titanium Exhaust Tips",
  variant: null,
  price: 8500,
  qty,
  image: null,
});
const coil = (variant: string, price: number, qty = 1): CartLine => ({
  slug: "coilover-suspension",
  title: "Coilover Suspension",
  variant,
  price,
  qty,
  image: null,
});

// --- merging ---------------------------------------------------------------

// The same thing added twice is one line at qty 2, not two lines.
let lines = addLine(addLine([], tips()), tips());
assert.equal(lines.length, 1);
assert.equal(lines[0].qty, 2);

// Two variants of one product are two separate lines.
lines = addLine(addLine([], coil("Swift", 42000)), coil("i20", 45000));
assert.equal(lines.length, 2);
assert.deepEqual(lines.map((l) => l.variant), ["Swift", "i20"]);

// --- quantity --------------------------------------------------------------

lines = addLine([], tips(2));
assert.equal(cartTotal(lines), 17000);

// Dropping to zero removes the line rather than leaving qty 0 in the message.
assert.deepEqual(setQty(lines, lineKey(tips()), 0), []);

// A typo cannot generate a four-thousand-unit order.
assert.equal(setQty(lines, lineKey(tips()), 9999)[0].qty, MAX_QTY);
assert.equal(setQty(lines, lineKey(tips()), -3).length, 0);

assert.deepEqual(removeLine(lines, lineKey(tips())), []);
// Removing something that is not there is a no-op, not a crash.
assert.equal(removeLine(lines, "nope").length, 1);

// A variant price overrides the base price it came from.
assert.equal(cartTotal([coil("Swift", 42000, 2), tips()]), 92500);

// --- loading ---------------------------------------------------------------

// Anything unreadable in localStorage resets to an empty cart instead of
// throwing on mount and taking the whole site down.
assert.deepEqual(loadCart(null), []);
assert.deepEqual(loadCart("not json"), []);
assert.deepEqual(loadCart('{"lines":[]}'), []);
assert.deepEqual(loadCart('[{"slug":"x","title":"X","qty":1}]'), []); // no price
assert.deepEqual(loadCart('[{"slug":"x","title":"X","price":1,"qty":1}]'), []); // old shape
assert.deepEqual(loadCart(JSON.stringify([tips()])), [tips()]);

// --- the WhatsApp message --------------------------------------------------

const msg = (ls: CartLine[]) =>
  decodeURIComponent(cartEnquiryLink(ls).split("?text=")[1]);

assert.equal(
  msg([tips(2), coil("Swift", 42000)]),
  [
    "Hey! I'd like to order from your store.",
    "",
    "2 x Titanium Exhaust Tips — ₹17,000",
    "1 x Coilover Suspension (Swift) — ₹42,000",
    "",
    "Total: ₹59,000",
    "",
    "Can you confirm availability?",
  ].join("\n"),
);

// No variant means no empty parentheses.
assert.ok(!msg([tips()]).includes("()"));

// A variant name is owner-typed free text; commas and newlines must survive
// both the CSV-free round trip and encodeURIComponent.
assert.ok(msg([coil("Swift, ZXi\n2019+", 1000)]).includes("(Swift, ZXi\n2019+)"));

// An empty cart must not offer to order ₹0 of nothing.
assert.ok(!msg([]).includes("Total"));

console.log("store ok");
