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
