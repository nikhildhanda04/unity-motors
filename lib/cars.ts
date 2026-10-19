import "server-only";
import { unstable_cache, updateTag } from "next/cache";
import { Prisma } from "./generated/prisma/client";
import { prisma } from "./db";
import type { Car, Media } from "./types";

export const CARS_TAG = "cars";

/** Prisma row -> the plain Car the rest of the app already speaks. */
type Row = {
  id: string;
  slug: string;
  title: string;
  price: number;
  priceOnRequest: boolean;
  year: number;
  kmDriven: number;
  fuelType: string;
  transmission: string;
  ownership: string;
  stateRegistered: string;
  loanAvailable: boolean;
  description: string;
  features: string[];
  images: unknown;
  video: unknown;
  sold: boolean;
  featured: boolean;
  createdAt: Date;
};

function toCar(row: Row): Car {
  return {
    ...row,
    images: (row.images as Media[]) ?? [],
    video: (row.video as Car["video"]) ?? null,
    // Components and the sitemap expect a serialisable string, not a Date.
    createdAt: row.createdAt.toISOString(),
  };
}

/** Unsold first, then newest first — matches the @@index on (sold, createdAt). */
const ORDER = [{ sold: "asc" as const }, { createdAt: "desc" as const }];

/**
 * Cached read. Neon's free tier bills compute time, so every page render
 * hitting the database would be wasteful as well as slow; mutations below
 * invalidate this tag so the site still updates instantly.
 */
export const getCars = unstable_cache(
  async (): Promise<Car[]> => {
    const rows = await prisma.car.findMany({ orderBy: ORDER });
    return rows.map(toCar);
  },
  ["cars-list"],
  // Mutations invalidate the tag for instant updates. The revalidate window is
  // the safety net: without it the cache never expires on its own, so anything
  // written outside the app (a SQL edit, a seed script) would be invisible
  // forever. 5 minutes costs almost no Neon compute.
  { tags: [CARS_TAG], revalidate: 300 },
);

export async function getCarBySlug(slug: string): Promise<Car | null> {
  const row = await prisma.car.findUnique({ where: { slug } });
  return row ? toCar(row) : null;
}

export async function getCarById(id: string): Promise<Car | null> {
  const row = await prisma.car.findUnique({ where: { id } });
  return row ? toCar(row) : null;
}

/** Next 16: updateTag gives read-your-own-writes inside a Server Action. */
function refresh() {
  updateTag(CARS_TAG);
}

export type CarInput = Omit<Car, "id" | "createdAt">;

export async function createCar(input: CarInput): Promise<Car> {
  const row = await prisma.car.create({
    data: { ...input, images: input.images, video: input.video ?? undefined },
  });
  refresh();
  return toCar(row);
}

export async function updateCar(id: string, input: CarInput): Promise<Car> {
  const row = await prisma.car.update({
    where: { id },
    // Prisma needs DbNull (SQL NULL), not JS null, to clear a nullable Json column.
    data: { ...input, images: input.images, video: input.video ?? Prisma.DbNull },
  });
  refresh();
  return toCar(row);
}

/** Single-row write — no read-modify-write, so concurrent edits can't clobber. */
export async function setSold(id: string, sold: boolean): Promise<void> {
  await prisma.car.update({ where: { id }, data: { sold } });
  refresh();
}

export async function setFeatured(id: string, featured: boolean): Promise<void> {
  await prisma.car.update({ where: { id }, data: { featured } });
  refresh();
}

/** Returns the deleted row so the caller can clean up its Cloudinary assets. */
export async function deleteCar(id: string): Promise<Car | null> {
  const row = await prisma.car.delete({ where: { id } }).catch(() => null);
  if (row) refresh();
  return row ? toCar(row) : null;
}

/** Slugs are URLs: a duplicate would make a car unreachable. */
export async function uniqueSlug(base: string, exceptId?: string) {
  const taken = new Set(
    (
      await prisma.car.findMany({
        where: exceptId ? { NOT: { id: exceptId } } : undefined,
        select: { slug: true },
      })
    ).map((c) => c.slug),
  );

  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) {
    const candidate = `${base}-${n}`;
    if (!taken.has(candidate)) return candidate;
  }
}
