/**
 * Seeds demo cars so /cars, /cars/[slug] and /admin can be seen working before
 * Cloudinary is configured. Uses the site's own photos in /public, so the
 * layout is judged against real material rather than stock placeholders.
 *
 *   npm run db:seed              # add the demo cars
 *   npm run db:seed -- --clean   # remove them again
 *
 * Every title below is fictional demo data. Replace with real stock.
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

const cars = [
  {
    slug: `${PREFIX}bmw-m4-competition`,
    title: "2019 BMW M4 Competition",
    price: 5450000,
    year: 2019,
    kmDriven: 42000,
    fuelType: "Petrol",
    transmission: "Automatic",
    ownership: "1st Owner",
    description:
      "Came to us for a full ceramic treatment and stayed. Paint corrected over two stages, PPF on the front end, fluids and brakes done in-house.\n\nCarbon bucket seats, Harman Kardon, no accident history.",
    features: [
      "Ceramic coated (9H)",
      "PPF — front end",
      "Carbon bucket seats",
      "Harman Kardon",
      "360° camera",
      "Sunroof",
    ],
    images: [shot("1.JPG"), shot("2.JPG"), shot("3.JPG"), shot("4.JPG")],
    featured: true,
  },
  {
    slug: `${PREFIX}audi-s5-sportback`,
    title: "2021 Audi S5 Sportback",
    price: 4800000,
    year: 2021,
    kmDriven: 28500,
    fuelType: "Petrol",
    transmission: "Automatic",
    ownership: "1st Owner",
    description:
      "Single owner, serviced with us since new. Full detail and interior deep clean completed before listing.",
    features: [
      "Full detail completed",
      "Virtual cockpit",
      "Bang & Olufsen",
      "Ventilated seats",
      "Matrix LED",
    ],
    images: [shot("5.JPG"), shot("7.jpg"), shot("8.jpg")],
    featured: true,
  },
  {
    slug: `${PREFIX}mercedes-c300`,
    title: "2018 Mercedes-Benz C300",
    price: 3200000,
    year: 2018,
    kmDriven: 61000,
    fuelType: "Diesel",
    transmission: "Automatic",
    ownership: "2nd Owner",
    description:
      "Honest car, higher mileage, priced accordingly. Suspension bushes and brakes replaced on arrival.",
    features: ["Suspension refreshed", "New brakes", "Burmester audio", "Sunroof"],
    images: [shot("9.jpg"), shot("10.png")],
    sold: true,
  },
];

try {
  await prisma.car.deleteMany({ where: { slug: { startsWith: PREFIX } } });

  if (process.argv.includes("--clean")) {
    console.log("demo cars removed");
  } else {
    for (const car of cars) await prisma.car.create({ data: car });
    console.log(`${cars.length} demo cars added -> /cars`);
  }
} finally {
  await prisma.$disconnect();
}
