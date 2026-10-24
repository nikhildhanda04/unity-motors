import "server-only";
import { unstable_cache, updateTag } from "next/cache";
import { prisma } from "./db";
import type { Media, Product, Variant } from "./types";

export const PRODUCTS_TAG = "products";

type Row = {
  id: string;
  slug: string;
  title: string;
  price: number;
  category: string;
  description: string;
  variants: unknown;
  images: unknown;
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
};

function toProduct(row: Row): Product {
  return {
    ...row,
    variants: (row.variants as Variant[]) ?? [],
    images: (row.images as Media[]) ?? [],
    createdAt: row.createdAt.toISOString(),
  };
}

/** In stock first, then newest first — matches the @@index on (inStock, createdAt). */
const ORDER = [{ inStock: "desc" as const }, { createdAt: "desc" as const }];

/** Cached like the car list, and invalidated by the same tag mechanism. */
export const getProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const rows = await prisma.product.findMany({ orderBy: ORDER });
    return rows.map(toProduct);
  },
  ["products-list"],
  { tags: [PRODUCTS_TAG], revalidate: 300 },
);

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { slug } });
  return row ? toProduct(row) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? toProduct(row) : null;
}

function refresh() {
  updateTag(PRODUCTS_TAG);
}

export type ProductInput = Omit<Product, "id" | "createdAt">;

export async function createProduct(input: ProductInput): Promise<Product> {
  const row = await prisma.product.create({
    data: { ...input, variants: input.variants, images: input.images },
  });
  refresh();
  return toProduct(row);
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<Product> {
  const row = await prisma.product.update({
    where: { id },
    data: { ...input, variants: input.variants, images: input.images },
  });
  refresh();
  return toProduct(row);
}

/** Single-row writes — no read-modify-write, so concurrent edits can't clobber. */
export async function setInStock(id: string, inStock: boolean): Promise<void> {
  await prisma.product.update({ where: { id }, data: { inStock } });
  refresh();
}

export async function setProductFeatured(
  id: string,
  featured: boolean,
): Promise<void> {
  await prisma.product.update({ where: { id }, data: { featured } });
  refresh();
}

/** Returns the deleted row so the caller can clean up its Cloudinary assets. */
export async function deleteProduct(id: string): Promise<Product | null> {
  const row = await prisma.product.delete({ where: { id } }).catch(() => null);
  if (row) refresh();
  return row ? toProduct(row) : null;
}

export async function uniqueProductSlug(base: string, exceptId?: string) {
  const taken = new Set(
    (
      await prisma.product.findMany({
        where: exceptId ? { NOT: { id: exceptId } } : undefined,
        select: { slug: true },
      })
    ).map((p) => p.slug),
  );

  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) {
    const candidate = `${base}-${n}`;
    if (!taken.has(candidate)) return candidate;
  }
}
