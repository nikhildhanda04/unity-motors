/**
 * Seeds demo parts so /store, /store/[slug], the cart and /admin can be seen
 * working before any real stock is entered. Uses the site's own images in
 * /public, so layout is judged against real material.
 *
 *   npm run db:seed:parts              # add the demo parts
 *   npm run db:seed:parts -- --clean   # remove them again
 *
 * Every title and price below is invented. The cart really does open WhatsApp,
 * so remove these before launch.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

const PREFIX = "demo-";

const shot = (file: string) => ({ url: `/${file}`, publicId: `local:${file}` });

const products = [
  {
    slug: `${PREFIX}coilover-suspension`,
    title: "Coilover Suspension Kit",
    price: 0,
    category: "Handling & Stance",
    description:
      "Height and damping adjustable, fitted and corner-balanced here. Ride quality stays usable on Indian roads — we set it up on the car, not on a spec sheet.\n\nFitting and alignment quoted separately.",
    // Carries options, so the listing reads "from ₹42,000".
    variants: [
      { name: "Swift / Baleno", price: 42000 },
      { name: "i20 / Venue", price: 45000 },
      { name: "Polo / Virtus", price: 48000 },
    ],
    images: [shot("suspension.png")],
    featured: true,
  },
  {
    slug: `${PREFIX}titanium-exhaust-tips`,
    title: "Titanium Exhaust Tips",
    price: 8500,
    category: "Exhaust & Aesthetics",
    description:
      "Burnt titanium, 3-inch inlet, clamp-on. Pair. Fitted free with any exhaust job.",
    variants: [],
    images: [shot("exhaust_tips.png")],
    featured: true,
  },
  {
    slug: `${PREFIX}precision-turbocharger`,
    title: "Precision Turbocharger",
    price: 0,
    category: "Performance",
    description:
      "Billet compressor wheel, journal bearing. Sold with the manifold and the remap — we do not fit one without the other.",
    variants: [
      { name: "Stage 1 — stock internals", price: 68000 },
      { name: "Stage 2 — forged", price: 94000 },
    ],
    images: [shot("turbocharger.png")],
    featured: true,
  },
  {
    // Out of stock on purpose: shows the dimmed card and the disabled button.
    slug: `${PREFIX}ceramic-coating-kit`,
    title: "9H Ceramic Coating Kit",
    price: 12500,
    category: "Detailing & Care",
    description:
      "The same coating we apply in the shop, boxed for people who want to do it themselves. Prep panels properly or do not bother.",
    variants: [],
    images: [shot("ceramic_coating.png")],
    inStock: false,
  },
];

try {
  await prisma.product.deleteMany({ where: { slug: { startsWith: PREFIX } } });

  if (process.argv.includes("--clean")) {
    console.log("demo parts removed");
  } else {
    for (const p of products) await prisma.product.create({ data: p });
    console.log(`${products.length} demo parts added -> /store`);
  }
} finally {
  await prisma.$disconnect();
}
