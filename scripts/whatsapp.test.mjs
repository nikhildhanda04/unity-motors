// Verifies the enquiry link is a valid wa.me URL with real line breaks.
import assert from "node:assert/strict";

const NUMBER = "919215593793";
const SITE = "https://unitymotors.in";
const fmt = (n) => new Intl.NumberFormat("en-IN").format(n);

function carEnquiryLink(car) {
  const price = car.priceOnRequest ? "Price on request" : `₹${fmt(car.price)}`;
  const text = [
    "Hey! I was looking at your website.",
    "",
    "I want to enquire about:",
    car.title,
    price,
    `${SITE}/cars/${car.slug}`,
    "",
    "Can you share more details about this?",
  ].join("\n");
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(text)}`;
}

const car = {
  title: "2019 BMW M4 Competition",
  price: 5450000,
  priceOnRequest: false,
  slug: "2019-bmw-m4-competition",
};

const link = carEnquiryLink(car);

// Must be a parseable URL pointing at wa.me/<number>
const u = new URL(link);
assert.equal(u.hostname, "wa.me");
assert.equal(u.pathname, `/${NUMBER}`);
assert.ok(/^\d{10,15}$/.test(NUMBER), "number is digits only, no + or spaces");

// Decoding must give back real newlines, not literal backslash-n
const text = u.searchParams.get("text");
assert.ok(text.includes("\n"), "message contains real line breaks");
assert.ok(!text.includes("\\n"), "message has no literal \\n");
assert.ok(link.includes("%0A"), "newlines encoded as %0A on the wire");

// Content the dealer needs to identify the car
assert.ok(text.includes("2019 BMW M4 Competition"), "title present");
assert.ok(text.includes("54,50,000"), "Indian price grouping");
assert.ok(text.includes(`${SITE}/cars/2019-bmw-m4-competition`), "deep link");

// Price-on-request variant must not print "₹0"
const por = carEnquiryLink({ ...car, priceOnRequest: true, price: 0 });
const porText = new URL(por).searchParams.get("text");
assert.ok(porText.includes("Price on request"));
assert.ok(!porText.includes("₹0"), "no bogus zero price");

// Titles with & / # must survive encoding
const odd = carEnquiryLink({ ...car, title: "Audi S5 #2 (B&O Sound)" });
assert.equal(
  new URL(odd).searchParams.get("text").includes("Audi S5 #2 (B&O Sound)"),
  true,
  "special characters survive encoding",
);

console.log("whatsapp: all assertions passed");
console.log("\nsample link:\n" + link);
console.log("\ndecoded message:\n---\n" + text + "\n---");
