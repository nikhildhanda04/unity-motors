This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# unity-motors

## Parts store

`/store` sells parts and accessories. Add them in `/admin` → **Parts**, the
same way cars are added.

- **Options** — leave empty for a part sold one way. Add them when the same
  part is sold per car, per size or per finish; each option carries its own
  price and replaces the single price field. The buyer must pick one before
  the Add to cart button unlocks.
- **In stock** — one checkbox. There are no unit counts, because the sale
  closes on WhatsApp and any count would drift out of sync.
- **Checkout** — the cart lives in the browser only. "Order on WhatsApp"
  opens a chat with every line and the total typed out, on the same number as
  car enquiries (`NEXT_PUBLIC_WHATSAPP_NUMBER`). Nothing is charged or stored.

Design and plan: `docs/superpowers/specs/2026-10-24-parts-store-design.md`.

## Customer reviews

Reviews come from a Google Form whose sheet is published as CSV. Setup —
including the moderation column that keeps anything unapproved off the site —
is in `docs/reviews-setup.md`.
