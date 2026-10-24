// Verifies the sheet reader: quoted commas and newlines survive, and nothing
// publishes without an explicit approval.
import assert from "node:assert/strict";
import { parseReviews } from "../lib/reviews";

const HEADER = "Timestamp,Your name,Which car or service did we work on?,Rating out of 5,Your review,Approved";

const csv = [
  HEADER,
  `24/10/2025 11:02:14,Ravi Sharma,"Ceramic coating, full body",5,"Took three days, worth every rupee.",Yes`,
  `24/10/2025 12:40:09,Troll,,1,Garbage,`,
  `25/10/2025 09:15:00,Aman,Swift headlight restore,4,"Line one\nLine two",yes`,
].join("\n");

const reviews = parseReviews(csv);

// Newest first, and the unapproved row never appears.
assert.deepEqual(reviews.map((r) => r.name), ["Aman", "Ravi Sharma"]);

// A comma inside a quoted field stays one field.
assert.equal(reviews[1].subject, "Ceramic coating, full body");
assert.equal(reviews[1].body, "Took three days, worth every rupee.");
assert.equal(reviews[1].rating, 5);

// So does a newline.
assert.equal(reviews[0].body, "Line one\nLine two");

// "5 - Excellent" style answers still give a number.
assert.equal(parseReviews(`${HEADER}\n,A,,5 - Excellent,Great,Yes`)[0].rating, 5);

// No Approved column at all: publish nothing rather than publish everything.
assert.deepEqual(
  parseReviews("Timestamp,Your name,Rating out of 5,Your review\n,A,5,Great"),
  [],
);

// Missing or malformed sheet.
assert.deepEqual(parseReviews(""), []);

console.log("reviews ok");
