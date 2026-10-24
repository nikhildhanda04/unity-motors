"use server";

import { redirect } from "next/navigation";
import {
  endSession,
  isAuthed,
  startSession,
  verifyCredentials,
} from "@/lib/auth";
import {
  createCar,
  deleteCar,
  getCarById,
  setFeatured,
  setSold,
  uniqueSlug,
  updateCar,
  type CarInput,
} from "@/lib/cars";
import {
  createProduct,
  deleteProduct,
  getProductById,
  setInStock,
  setProductFeatured,
  updateProduct,
  uniqueProductSlug,
  type ProductInput,
} from "@/lib/products";
import { destroyAssets } from "@/lib/cloudinary";
import { slugify, type Car, type Product, type Variant } from "@/lib/types";

/** Every mutating action calls this first. The proxy guards navigation,
 *  not server actions — these are directly invocable endpoints. */
async function requireAuth() {
  if (!(await isAuthed())) throw new Error("Not authorised");
}

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const phone = String(formData.get("phone") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!verifyCredentials(phone, password)) {
    // One generic message for every failure mode. Saying "that number isn't
    // registered" would confirm which numbers exist.
    return { error: "Incorrect phone number or password." };
  }

  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export async function toggleSold(id: string) {
  await requireAuth();
  const car = await getCarById(id);
  if (car) await setSold(id, !car.sold);
}

export async function toggleFeatured(id: string) {
  await requireAuth();
  const car = await getCarById(id);
  if (car) await setFeatured(id, !car.featured);
}

export async function removeCar(id: string) {
  await requireAuth();

  const car = await deleteCar(id);

  // Only after the row is gone, so a Cloudinary hiccup can't leave a car
  // listed with dead media. Orphaned assets are the lesser failure.
  if (car) {
    await destroyAssets([
      ...car.images.map((i) => ({ publicId: i.publicId, kind: "image" as const })),
      ...(car.video
        ? [{ publicId: car.video.publicId, kind: "video" as const }]
        : []),
    ]);
  }
}

export type SaveState = { error?: string };

export async function saveCar(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  await requireAuth();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };

  const priceOnRequest = formData.get("priceOnRequest") === "on";
  const price = Number(formData.get("price") ?? 0);
  if (!priceOnRequest && (!Number.isFinite(price) || price <= 0)) {
    return { error: "Enter a valid price, or tick “Price on request”." };
  }

  let images: Car["images"];
  let video: Car["video"];
  try {
    images = JSON.parse(String(formData.get("images") || "[]"));
    video = JSON.parse(String(formData.get("video") || "null"));
  } catch {
    return { error: "Media data was malformed. Re-upload and try again." };
  }
  if (!images.length) return { error: "Add at least one photo." };

  const features = String(formData.get("features") ?? "")
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);

  const isNew = !id || id === "new";
  const existing = isNew ? null : await getCarById(id);
  if (!isNew && !existing) return { error: "That car no longer exists." };

  const base = slugify(String(formData.get("slug") || "") || title);
  const slug = await uniqueSlug(base || `car-${Date.now()}`, existing?.id);

  const num = (k: string) => {
    const v = Number(formData.get(k) ?? 0);
    return Number.isFinite(v) && v > 0 ? v : 0;
  };

  const input: CarInput = {
    slug,
    title,
    price: priceOnRequest ? 0 : Math.round(price),
    priceOnRequest,
    year: num("year"),
    kmDriven: num("kmDriven"),
    fuelType: String(formData.get("fuelType") ?? ""),
    transmission: String(formData.get("transmission") ?? ""),
    ownership: String(formData.get("ownership") ?? ""),
    stateRegistered: String(formData.get("stateRegistered") ?? ""),
    // An unticked checkbox submits nothing at all, so absence means false.
    // The form decides the default; this only records what was submitted.
    loanAvailable: formData.get("loanAvailable") === "on",
    description: String(formData.get("description") ?? "").trim(),
    features,
    images,
    video,
    sold: formData.get("sold") === "on",
    featured: formData.get("featured") === "on",
  };

  // Assets dropped during an edit must be cleaned up, or they bill forever.
  if (existing) {
    const kept = new Set([
      ...input.images.map((i) => i.publicId),
      ...(input.video ? [input.video.publicId] : []),
    ]);
    const orphans = [
      ...existing.images
        .filter((i) => !kept.has(i.publicId))
        .map((i) => ({ publicId: i.publicId, kind: "image" as const })),
      ...(existing.video && !kept.has(existing.video.publicId)
        ? [{ publicId: existing.video.publicId, kind: "video" as const }]
        : []),
    ];
    if (orphans.length) await destroyAssets(orphans);
  }

  if (existing) await updateCar(existing.id, input);
  else await createCar(input);

  redirect("/admin");
}

// ---- Products -------------------------------------------------------------

export async function toggleInStock(id: string) {
  await requireAuth();
  const product = await getProductById(id);
  if (product) await setInStock(id, !product.inStock);
}

export async function toggleProductFeatured(id: string) {
  await requireAuth();
  const product = await getProductById(id);
  if (product) await setProductFeatured(id, !product.featured);
}

export async function removeProduct(id: string) {
  await requireAuth();

  const product = await deleteProduct(id);

  // Row first, assets after — same ordering as removeCar. An orphaned
  // Cloudinary asset is a cheaper failure than a listing with dead media.
  if (product) {
    await destroyAssets(
      product.images.map((i) => ({ publicId: i.publicId, kind: "image" as const })),
    );
  }
}

export async function saveProduct(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  await requireAuth();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };

  let images: Product["images"];
  let variants: Variant[];
  try {
    images = JSON.parse(String(formData.get("images") || "[]"));
    variants = JSON.parse(String(formData.get("variants") || "[]"));
  } catch {
    return { error: "Form data was malformed. Re-upload and try again." };
  }
  if (!images.length) return { error: "Add at least one photo." };

  // A row the owner started and abandoned is not an option; an unnamed one
  // would show as a blank chip on the product page.
  variants = variants
    .map((v) => ({ name: String(v.name ?? "").trim(), price: Math.round(Number(v.price) || 0) }))
    .filter((v) => v.name !== "");

  if (variants.some((v) => v.price <= 0)) {
    return { error: "Every option needs a price above zero." };
  }
  // The cart keys lines by slug + variant name, so two options sharing a name
  // would merge into one line at the wrong price.
  if (new Set(variants.map((v) => v.name.toLowerCase())).size !== variants.length) {
    return { error: "Two options have the same name. Make them distinct." };
  }

  const price = Math.round(Number(formData.get("price") ?? 0));
  if (variants.length === 0 && (!Number.isFinite(price) || price <= 0)) {
    return { error: "Enter a price, or add options that carry their own." };
  }

  const isNew = !id || id === "new";
  const existing = isNew ? null : await getProductById(id);
  if (!isNew && !existing) return { error: "That product no longer exists." };

  const base = slugify(String(formData.get("slug") || "") || title);
  const slug = await uniqueProductSlug(base || `part-${Date.now()}`, existing?.id);

  const productInput: ProductInput = {
    slug,
    title,
    // With options, the base price is never charged — store 0 rather than a
    // stale number that looks authoritative in the database.
    price: variants.length ? 0 : price,
    // "__new__" is the dropdown's sentinel for "let me type one"; the select
    // unmounts the moment it is chosen, but never store it if one slips through.
    category: (() => {
      const c = String(formData.get("category") ?? "").trim();
      return c === "__new__" ? "" : c;
    })(),
    description: String(formData.get("description") ?? "").trim(),
    variants,
    images,
    // An unticked checkbox submits nothing at all, so absence means false.
    inStock: formData.get("inStock") === "on",
    featured: formData.get("featured") === "on",
  };

  // Photos dropped during an edit must be cleaned up, or they bill forever.
  if (existing) {
    const kept = new Set(productInput.images.map((i) => i.publicId));
    const orphans = existing.images
      .filter((i) => !kept.has(i.publicId))
      .map((i) => ({ publicId: i.publicId, kind: "image" as const }));
    if (orphans.length) await destroyAssets(orphans);
  }

  if (existing) await updateProduct(existing.id, productInput);
  else await createProduct(productInput);

  redirect("/admin/products");
}
