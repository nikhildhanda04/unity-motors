import assert from "node:assert/strict";
import { RATIO, coverRect, pan, zoomOf, zoomTo } from "../lib/crop";

const inside = (r: { x: number; y: number; w: number; h: number }, nat: { w: number; h: number }) =>
  r.x >= -1e-6 && r.y >= -1e-6 && r.x + r.w <= nat.w + 1e-6 && r.y + r.h <= nat.h + 1e-6;

// Portrait phone photo: full width, vertically centred, exactly 4:3.
const portrait = { w: 3000, h: 4000 };
let r = coverRect(portrait.w, portrait.h);
assert.equal(r.w, 3000);
assert.ok(Math.abs(r.w / r.h - RATIO) < 1e-9);
assert.equal(r.x, 0);
assert.equal(r.y, (4000 - 2250) / 2);

// Landscape wider than 4:3: full height, horizontally centred.
const wide = { w: 4000, h: 2000 };
r = coverRect(wide.w, wide.h);
assert.equal(r.h, 2000);
assert.ok(Math.abs(r.w / r.h - RATIO) < 1e-9);

// Panning can never push the frame off the image.
r = pan(coverRect(portrait.w, portrait.h), portrait, -9999, -9999);
assert.ok(inside(r, portrait));
r = pan(r, portrait, 9999, 9999);
assert.ok(inside(r, portrait));

// Zoom round-trips, stays 4:3, stays inside, and clamps at both ends.
for (const z of [1, 1.5, 2.75, 4]) {
  const zr = zoomTo(coverRect(portrait.w, portrait.h), portrait, z);
  assert.ok(Math.abs(zoomOf(zr, portrait) - z) < 1e-9, `zoom ${z}`);
  assert.ok(Math.abs(zr.w / zr.h - RATIO) < 1e-9);
  assert.ok(inside(zr, portrait));
}
assert.equal(zoomOf(zoomTo(coverRect(3000, 4000), portrait, 0.2), portrait), 1);
assert.equal(zoomOf(zoomTo(coverRect(3000, 4000), portrait, 99), portrait), 4);

// Zooming in at a corner keeps the frame inside rather than overflowing.
const corner = pan(coverRect(portrait.w, portrait.h), portrait, 9999, 9999);
assert.ok(inside(zoomTo(corner, portrait, 3), portrait));

console.log("crop geometry ok");
