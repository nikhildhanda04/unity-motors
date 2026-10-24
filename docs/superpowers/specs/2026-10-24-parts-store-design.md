# Parts store — design

**Status:** awaiting approval · **Date:** 2026-10-24

## Intent

Sell physical parts and accessories (turbochargers, exhaust tips, coilovers,
coatings) from `unitymotor.in/store`. The site already advertises this as
"Exclusive Parts Store — Coming Soon" in `shop-teaser.tsx`; this replaces the
placeholder with the real thing.

The store is the cars register with a cart bolted on. Same admin, same
Cloudinary uploads, same ending: **every sale closes on WhatsApp**, on the one
number the workshop already watches. Nothing new to run, nothing new to pay
for, no payment gateway.

### Why this and not Instagram Shopping

A real store at a real URL is also the precondition for an Instagram shop
later — a Commerce Manager catalogue needs product pages on a domain you own.
Cars and services can never be tagged on Instagram; parts can. That is a
downstream maybe, not a goal of this work.

## Goals

- Add a product in `/admin` as fast as adding a car.
- Buyer picks a variant, sets a quantity, adds to cart, keeps browsing.
- One tap at the end opens WhatsApp with the whole cart typed out.
- Store reads as part of the same site — same black, same red, same weight.

## Non-goals

- Online payment of any kind. No gateway, no UPI intent, no COD flow.
- An orders table, an order number, or an order status screen.
- Stock counts. Shipping charges, pincode serviceability, GST, invoices.
- Customer accounts, saved carts across devices, wishlists, search, reviews.
- Cars in the cart. Cars keep their own one-car enquiry link, untouched.

## Anti-goals

Things that would make this a failure even if it technically worked:

- **The cart surviving as a lie.** A cart that shows a stale price, or shows
  the car enquiry flow, is worse than no cart. One flow, one meaning.
- **An empty store on the homepage.** Like `cars-teaser`, the teaser renders
  nothing until real products exist. No "coming soon" that stays forever.
- **A second admin.** If adding a product feels different from adding a car,
  the owner will not use it.
- **Cart UI on every page of a detailing site.** The cart button appears only
  once something is in it.

## Decisions already made

Settled by the owner, 2026-10-24:

1. **Variants carry their own price.** A product can offer named options
   (`Swift — ₹42,000`, `i20 — ₹45,000`). A product with no variants just has
   its one price.
2. **Stock is a boolean, not a count.** One "In stock" checkbox, like the
   cars' `sold` flag. No decrementing, no overselling logic — the sale closes
   on WhatsApp, so any count would drift out of sync within a week.
3. **Checkout carries items and total only.** No name, no address, no form.
   Exactly the car enquiry's handoff, with more lines.

Stock stays at product level even though variants carry prices — (2) decides
it. A single out-of-stock variant is handled by deleting it from the list.

**Base price vs variant price.** When a product has variants, `price` is
ignored for the sale and the listing reads "from <lowest variant price>". The
admin form hides the base price field once the first variant row is added, so
there is no second number to keep in sync. A product with no variants uses
`price` and requires it.

## Data

```prisma
model Product {
  id          String   @id @default(uuid())
  slug        String   @unique
  title       String
  // Base price. When variants exist, each variant's price wins and the
  // listing shows "from <lowest>".
  price       Int      @default(0)
  category    String   @default("")
  description String   @default("")
  // [{ name, price }] — empty for a product sold one way only.
  variants    Json     @default("[]")
  images      Json     @default("[]")
  inStock     Boolean  @default(true)
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())

  @@index([inStock, createdAt])
  @@map("products")
}
```

`lib/types.ts` gains `Variant`, `Product`, and a fixed `PRODUCT_CATEGORIES`
list (free-text categories would give three spellings of "Exhaust" and a
broken filter row). Seed it from the existing teaser: Performance, Exhaust &
Aesthetics, Handling & Stance, Detailing & Care, Interior, Other.

`lib/products.ts` mirrors `lib/cars.ts` exactly — `unstable_cache` with a
`products` tag, 5-minute revalidate, `updateTag` on every mutation, a
`uniqueSlug`. No shared abstraction over the two: they are 90 similar lines,
and a generic repository layer to save them would cost more to read than both.

## Cart

Client-side only, in `localStorage`. No cart rows in Postgres — a cart that
ends in a WhatsApp message does not need to outlive the browser.

```ts
type CartLine = {
  slug: string;      // links back to the product page
  title: string;
  variant: string | null;
  price: number;
  qty: number;
};
```

Lines are keyed by `slug + variant`, so adding the same variant twice bumps
`qty` instead of making a second line.

Title and price are copied into the line rather than looked up. The cart
therefore renders with no database read, and can go stale if the owner edits a
price mid-session. Accepted: the message is an enquiry and the owner confirms
the price in chat anyway. Marked with a `ponytail:` comment naming the
staleness and the upgrade path (re-read prices on cart open).

Exposed as a context provider in `app/layout.tsx` plus a `useCart()` hook, in
one file. Hydration: lines load in an effect after mount, so the server and
first client render agree on an empty cart.

## Screens

**`/store`** — heading in the `cars-teaser` register, a row of category filter
chips (the active one in a `?category=` search param, so a filtered view is
shareable and the page stays a server component), then a responsive grid of
product cards: photo, title, category,
price or "from ₹x". Out-of-stock cards render dimmed with the add button
replaced by the words "Out of stock". Empty store renders a short line, not a
broken grid.

**`/store/[slug]`** — photo gallery reusing the car gallery's behaviour,
title, price, description, variant picker (a row of selectable chips, nothing
preselected when variants exist), quantity stepper, and **Add to cart**.
With variants, the price reads "from ₹x" and **Add to cart is disabled until a
variant is picked** — a preselected default gets bought by accident. Quantity
caps at 99; with no stock counts there is nothing else stopping a typo from
generating a 4,000-unit WhatsApp message.
Adding opens the cart drawer so the action is visibly confirmed. Static params
generated like `/cars/[slug]` does.

**Cart drawer** — slides from the right, over any page. Lines with thumbnail,
title, variant, qty stepper, remove. Total at the bottom. One red full-width
**Order on WhatsApp** button. Opens in a new tab; the cart is *not* cleared on
tap, because the customer may not have sent the message yet.

**Navbar** — a cart button with a count badge, rendered only when the cart has
lines, and a "Store" link alongside "Cars". `navbar.tsx` currently has
uncommitted changes; this builds on whatever is on disk.

**Sitemap** — `sitemap.ts` gains `/store` and every product page, alongside
the car entries already there.

**Homepage** — `shop-teaser.tsx` loses its hardcoded three items and its
"Coming Soon" badge and reads three products — featured ones if any are marked, newest
otherwise — and returns `null` when there are none. Same contract as `cars-teaser`.

**`/admin`** — gains a Cars / Products switch at the top. `/admin/products`
lists products with the same row affordances as cars (edit, in-stock toggle,
featured toggle, delete). `/admin/product/[id]` is the form: title, category,
description, price, variants (add/remove rows of name + price), photos, and
two checkboxes.

The product form is written fresh, not generalised out of `car-form.tsx` —
that file is 535 lines of car-specific fields and the shared part is four
Tailwind class strings. Those four move to `app/admin/ui.ts` and both forms
import them, so the screens cannot drift apart. Photo upload reuses
`uploadToCloudinary` and `PhotoCropper` unchanged, at the existing 4:3 crop.

## WhatsApp handoff

`lib/whatsapp.ts` gains one function beside `carEnquiryLink`:

```
Hey! I'd like to order from your store.

2 x Titanium Exhaust Tips — ₹17,000
1 x Coilover Suspension (Swift) — ₹42,000

Total: ₹59,000

Can you confirm availability?
```

Indian digit grouping via the existing `formatPrice`. Line prices are
`price * qty`.

## Deletion cleanup

Removing a product destroys its Cloudinary assets, and an edit that drops a
photo destroys the orphan — the same ordering `removeCar` and `saveCar`
already use (row first, assets after; an orphaned asset beats a listing with
dead media).

## Verification

`scripts/store.test.mts`, added to `npm test`:

- adding the same slug+variant twice merges into one line at qty 2
- the same slug with two different variants stays two lines
- line total and cart total, including a variant price overriding the base
- the generated `wa.me` URL decodes to the expected message with real newlines

Cart reducer logic is pure and lives in `lib/cart.ts` so the test imports it
without React — the same split `lib/crop.ts` already uses.

## Calls made in review, not by the owner

The base-price-hidden-when-variants rule, add-to-cart disabled until a variant
is picked, the 99 quantity cap, `?category=` as the filter, blank/duplicate
variant handling, and the sitemap entries are all the author's calls. Each is
a one-line change if the owner wants it differently.

## Left to the builder

- Exact drawer animation and breakpoints; match `car-gallery.tsx`'s feel.
- Whether the category chip row scrolls horizontally on mobile or wraps.
- Copy on the empty-cart state.
- Whether `/store` or `/shop` — `/store` is assumed throughout; the teaser
  component keeps its `shop-teaser` filename either way.

## Sequencing

Schema and `lib/products.ts` → admin list and form → `/store` and
`/store/[slug]` → cart and drawer → WhatsApp link → teaser swap, navbar, and
sitemap.

Each step is independently shippable; the store is reachable and useful before
the cart exists.
