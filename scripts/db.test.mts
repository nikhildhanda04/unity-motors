// End-to-end against the real Neon database: create -> read -> toggle -> delete.
// Cleans up after itself. Run: npm run test:db  (tsx — the generated
// Prisma 7 client is .ts with extensionless imports, so plain node cannot load it)
import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaNeon } from "@prisma/adapter-neon";
import { Prisma, PrismaClient } from "../lib/generated/prisma/client";
import assert from "node:assert/strict";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

const SLUG = "__smoke-test-car";
let id;

try {
  await prisma.car.deleteMany({ where: { slug: { startsWith: SLUG } } });

  // --- create, with the exact shapes the app writes ---
  const created = await prisma.car.create({
    data: {
      slug: SLUG,
      title: "Smoke Test M4",
      price: 5450000,
      year: 2019,
      kmDriven: 42000,
      fuelType: "Petrol",
      transmission: "Automatic",
      ownership: "1st Owner",
      description: "line one\nline two",
      features: ["Sunroof", "360° Camera"],
      images: [{ url: "https://res.cloudinary.com/x/image/upload/a.jpg", publicId: "a" }],
      video: { url: "https://res.cloudinary.com/x/video/upload/v.mp4", publicId: "v", poster: "p.jpg" },
    },
  });
  id = created.id;

  assert.ok(created.id, "uuid default generated");
  assert.equal(created.sold, false, "defaults applied");
  assert.equal(created.featured, false);
  assert.ok(created.createdAt instanceof Date, "createdAt is a Date");

  // --- json + array columns survive the round trip ---
  const read = await prisma.car.findUnique({ where: { slug: SLUG } });
  assert.ok(read, "created row is readable");
  const images = read.images as { publicId: string }[];
  const video = read.video as { poster: string };
  assert.deepEqual(read.features, ["Sunroof", "360° Camera"], "text[] round trip");
  assert.equal(images[0].publicId, "a", "jsonb images round trip");
  assert.equal(video.poster, "p.jpg", "jsonb video round trip");
  assert.ok(read.description.includes("\n"), "newlines preserved in description");
  assert.equal(read.price, 5450000, "price is an exact integer");

  // --- the unique constraint actually protects slugs ---
  await assert.rejects(
    () => prisma.car.create({ data: { slug: SLUG, title: "Duplicate" } }),
    "duplicate slug must be rejected by the DB",
  );

  const must = async (carId: string) => {
    const r = await prisma.car.findUnique({ where: { id: carId } });
    assert.ok(r, "row still present");
    return r;
  };

  // --- single-row toggles (what Mark Sold / Feature do) ---
  await prisma.car.update({ where: { id }, data: { sold: true } });
  assert.equal((await must(id)).sold, true);
  await prisma.car.update({ where: { id }, data: { sold: false } });
  assert.equal((await must(id)).sold, false, "sold is reversible");

  // --- clearing a nullable json column ---
  await prisma.car.update({ where: { id }, data: { video: Prisma.DbNull } });
  assert.equal((await must(id)).video, null, "video cleared to SQL NULL");

  // --- ordering: unsold first, newest first ---
  const older = await prisma.car.create({
    data: { slug: SLUG + "-old", title: "Older", sold: true },
  });
  const ordered = await prisma.car.findMany({
    where: { slug: { startsWith: SLUG } },
    orderBy: [{ sold: "asc" }, { createdAt: "desc" }],
  });
  assert.equal(ordered[0].sold, false, "unsold sorts before sold");
  await prisma.car.delete({ where: { id: older.id } });

  // --- delete returns the row (so Cloudinary cleanup can use it) ---
  const deleted = await prisma.car.delete({ where: { id } });
  assert.equal(deleted.slug, SLUG, "delete returns the deleted row");
  assert.equal(await prisma.car.findUnique({ where: { id } }), null, "row is gone");
  id = null;

  console.log("db: all assertions passed against Neon");
} finally {
  await prisma.car.deleteMany({ where: { slug: { startsWith: SLUG } } }).catch(() => {});
  await prisma.$disconnect();
}
