# Parts Store Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sell parts and accessories from `/store` with a localStorage cart that hands off to WhatsApp.

**Architecture:** `Product` mirrors `Car` — same Prisma model shape, same `unstable_cache` repository, same admin CRUD and Cloudinary cleanup. The cart is pure functions in `lib/cart.ts` wrapped by one React context, persisted to localStorage, ending in a `wa.me` link built beside `carEnquiryLink`.

**Tech Stack:** Next 16 (App Router, server components, server actions), Prisma 7 / Neon Postgres, Tailwind 4, framer-motion, Cloudinary.

**Spec:** `docs/superpowers/specs/2026-10-24-parts-store-design.md`

## Global Constraints

- No payment gateway, no `Order` model, no stock counts. Sales close on WhatsApp.
- Palette and type scale copy `cars-teaser.tsx`: bg `#0a0f12`, accent `#E43E3D`, rule `#23292d`, panel `#0e1316`.
- Prices are integer rupees, rendered with `formatPrice` (Indian grouping).
- Public sections render `null` rather than an empty state when there is no data.
- No new npm dependencies.
- Tests are `assert`-based `.mts` scripts run by `tsx`, appended to the `test` script.

## Review Focus

Inputs the spec implies but no happy path exercises:

1. A product whose variants were all deleted after a cart line referenced one — the line must still render and still total correctly.
2. A cart line for a product that was deleted entirely — the drawer must not crash on a dead `slug`.
3. `localStorage` holding malformed or old-shape JSON — must reset to an empty cart, not throw on mount.
4. A variant name containing a comma, emoji or newline — must survive into the `wa.me` URL intact.
5. Quantity driven to 0 by the stepper — must remove the line, never leave `qty: 0` in the message.

Each is pinned by a test in Task 2 or Task 3.

---

### Task 1: Product data layer

**Files:** Create `lib/products.ts`; Modify `prisma/schema.prisma`, `lib/types.ts`

**Produces:** `Product`, `Variant`, `PRODUCT_CATEGORIES`, `productPrice(p)`, `getProducts()`, `getProductBySlug()`, `getProductById()`, `createProduct()`, `updateProduct()`, `setInStock()`, `setProductFeatured()`, `deleteProduct()`, `uniqueProductSlug()`, `ProductInput`, `PRODUCTS_TAG`

- [ ] Add the `Product` model from the spec's Data section to `prisma/schema.prisma`; `npx prisma db push && npx prisma generate`.
- [ ] Add `Variant`, `Product`, `PRODUCT_CATEGORIES` to `lib/types.ts`, plus `productPrice(p: Product): { from: boolean; amount: number }` returning the lowest variant price when variants exist, else `p.price`.
- [ ] Write `lib/products.ts` as a transliteration of `lib/cars.ts`: same `unstable_cache` + `revalidate: 300` + `updateTag` structure, ordered `inStock desc, createdAt desc`.
- [ ] Verify: `npx tsc --noEmit`.
- [ ] Commit.

### Task 2: Cart logic

**Files:** Create `lib/cart.ts`, `scripts/store.test.mts`; Modify `package.json`

**Produces:** `CartLine`, `lineKey(l)`, `addLine(lines, line)`, `setQty(lines, key, qty)`, `removeLine(lines, key)`, `cartTotal(lines)`, `loadCart(raw)`, `MAX_QTY = 99`

- [ ] Write `scripts/store.test.mts` covering: same slug+variant merges to one line at qty 2; same slug, two variants stays two lines; `cartTotal` sums `price * qty`; `setQty(..., 0)` removes the line; `setQty` clamps above `MAX_QTY`; `loadCart` on malformed JSON, on a non-array, and on an array holding a line missing `price` all return `[]`.
- [ ] Run it, confirm it fails on the missing module.
- [ ] Implement `lib/cart.ts`. Pure functions only, no React, no `localStorage` — `loadCart` takes the raw string so it is testable in node.
- [ ] Run `npx tsx scripts/store.test.mts`, expect pass. Append it to `package.json`'s `test` script.
- [ ] Commit.

### Task 3: WhatsApp cart link

**Files:** Modify `lib/whatsapp.ts`, `scripts/store.test.mts`

**Consumes:** `CartLine`, `cartTotal` (Task 2)
**Produces:** `cartEnquiryLink(lines: CartLine[]): string`

- [ ] Extend `scripts/store.test.mts`: `decodeURIComponent` of the generated URL equals the exact message in the spec's WhatsApp section for a two-line cart; a line with no variant omits the parenthesis; a variant name containing `,` and a newline round-trips unchanged; an empty cart yields the general enquiry text rather than a message with a ₹0 total.
- [ ] Run, confirm failure.
- [ ] Implement `cartEnquiryLink` beside `carEnquiryLink`, reusing `enquiryNumber()` and `formatPrice`.
- [ ] Run tests, expect pass. Commit.

### Task 4: Cart provider and drawer

**Files:** Create `app/components/cart.tsx`; Modify `app/layout.tsx`, `app/components/navbar.tsx`

**Consumes:** Task 2 and Task 3 exports
**Produces:** `<CartProvider>`, `useCart()` returning `{ lines, add, setQty, remove, total, open, setOpen, count }`, `<CartDrawer>`, `<CartButton>`

- [ ] `"use client"`. Lines start `[]`; a mount effect calls `loadCart(localStorage.getItem("um-cart"))` so server and first client render agree. A second effect writes back on change.
- [ ] Drawer: fixed right panel over a scrim, framer-motion, thumbnail + title + variant + qty stepper + remove per line, total, and a full-width `#E43E3D` **Order on WhatsApp** anchor to `cartEnquiryLink(lines)` with `target="_blank"`. Does not clear the cart. A line whose product is gone still renders from its own stored fields.
- [ ] `<CartButton>`: renders `null` when `count === 0`; otherwise a cart icon with a count badge that calls `setOpen(true)`.
- [ ] Wrap `children` in `<CartProvider>` in `app/layout.tsx` and mount `<CartDrawer>` there. Add `<CartButton>` and a `Store` link to `navbar.tsx`.
- [ ] Verify: `npx next build`. Commit.

### Task 5: Store pages

**Files:** Create `app/store/page.tsx`, `app/store/[slug]/page.tsx`, `app/components/product-card.tsx`, `app/components/add-to-cart.tsx`; Modify `app/sitemap.ts`

**Consumes:** Task 1 and Task 4 exports

- [ ] `/store`: server component. Heading in the `cars-teaser` register, category chips linking to `?category=`, grid of `<ProductCard>`. Out-of-stock cards dim and show "Out of stock". `metadata` export like `app/cars/page.tsx`.
- [ ] `/store/[slug]`: `generateStaticParams` and `generateMetadata` mirroring `app/cars/[slug]/page.tsx`; gallery, title, price (`from ₹x` when variants exist), description, then `<AddToCart product={...} />`.
- [ ] `<AddToCart>` is `"use client"`: variant chips with nothing preselected, qty stepper capped at `MAX_QTY`, button disabled while variants exist and none is chosen, and disabled entirely when `!inStock`. On click, `add()` then `setOpen(true)`.
- [ ] Add `/store` and every product slug to `app/sitemap.ts`.
- [ ] Verify: `npx next build`. Commit.

### Task 6: Admin products

**Files:** Create `app/admin/ui.ts`, `app/admin/products/page.tsx`, `app/admin/product-row.tsx`, `app/admin/product/[id]/page.tsx`, `app/admin/product/[id]/product-form.tsx`; Modify `app/admin/actions.ts`, `app/admin/page.tsx`, `app/admin/car/[id]/car-form.tsx`, `proxy.ts`

**Consumes:** Task 1 exports

- [ ] Move the `input`, `label`, `panel`, `heading` class strings out of `car-form.tsx` into `app/admin/ui.ts`; import them back. No visual change.
- [ ] Add to `app/admin/actions.ts`, each calling `requireAuth()` first: `saveProduct(prev, formData)`, `removeProduct(id)`, `toggleInStock(id)`, `toggleProductFeatured(id)`. `saveProduct` parses `variants` from a JSON field, drops rows with a blank name, rejects duplicate names, requires a price only when there are no variants, and runs the same orphaned-asset cleanup `saveCar` does.
- [ ] Add a Cars / Products switch to the top of `app/admin/page.tsx` and build `/admin/products` with `<ProductRow>` mirroring `car-row.tsx`.
- [ ] Build `product-form.tsx`: title, category select, description, price (hidden once a variant row exists), repeatable variant rows (name + price), photos via `uploadToCloudinary` + `PhotoCropper`, `inStock` and `featured` checkboxes.
- [ ] Confirm `proxy.ts` already guards `/admin/*`; widen the matcher if it is path-specific.
- [ ] Verify: `npx next build`, then add, edit and delete a product in the running app. Commit.

### Task 7: Teaser, and finish

**Files:** Modify `app/components/shop-teaser.tsx`, `README.md`, `.env.example`

- [ ] Rewrite `shop-teaser.tsx` as an async server component: drop the hardcoded array and the "Coming Soon" badge, read featured products (newest as fallback), take 3, `return null` when empty, link to `/store`.
- [ ] Document the store in `README.md` beside the cars section.
- [ ] Verify: `npm test`, `npx eslint`, `npx next build` all clean. Commit.
