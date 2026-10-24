export type Media = { url: string; publicId: string };

export type Car = {
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
  images: Media[];
  video: (Media & { poster: string }) | null;
  sold: boolean;
  featured: boolean;
  createdAt: string;
};

export const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];
export const TRANSMISSIONS = ["Automatic", "Manual"];
export const OWNERSHIPS = ["1st Owner", "2nd Owner", "3rd Owner", "4th Owner+"];

/**
 * RTO registration states. A fixed list rather than free text so the spec
 * line never shows "haryana", "Haryana" and "HR" as three different values.
 * Neighbours of the Karnal workshop lead; the rest follow alphabetically.
 */
export const REGISTRATION_STATES = [
  "Haryana",
  "Delhi",
  "Punjab",
  "Chandigarh",
  "Uttar Pradesh",
  "Uttarakhand",
  "Himachal Pradesh",
  "Rajasthan",
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Goa",
  "Gujarat",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "West Bengal",
];

/** Indian grouping: 5450000 -> "54,50,000" */
export const formatPrice = (n: number) => new Intl.NumberFormat("en-IN").format(n);

export const formatKm = (n: number) => new Intl.NumberFormat("en-IN").format(n);

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/** A named way to buy one product, with its own price: "Swift" at ₹42,000. */
export type Variant = { name: string; price: number };

export type Product = {
  id: string;
  slug: string;
  title: string;
  price: number;
  category: string;
  description: string;
  variants: Variant[];
  images: Media[];
  inStock: boolean;
  featured: boolean;
  createdAt: string;
};

/**
 * Starting categories, seeded from what the homepage teaser already
 * advertised. The admin dropdown offers these plus every category already in
 * use, and lets the owner type a new one — so the list grows without a code
 * change, while picking an existing entry stays easier than retyping it. That
 * is what keeps three spellings of "Exhaust" from appearing.
 */
export const PRODUCT_CATEGORIES = [
  "Performance",
  "Exhaust & Aesthetics",
  "Handling & Stance",
  "Detailing & Care",
  "Interior",
  "Other",
];

/**
 * What a listing shows. With variants the base price is not for sale, so the
 * card reads "from <cheapest variant>" instead of a number nobody can pay.
 */
export function productPrice(p: Pick<Product, "price" | "variants">) {
  if (p.variants.length === 0) return { from: false, amount: p.price };
  return { from: true, amount: Math.min(...p.variants.map((v) => v.price)) };
}
