import type { Car } from "./types";
import { formatPrice } from "./types";

const siteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://unitymotors.in";

/**
 * Click-to-chat link. No server, no session, no API — WhatsApp opens with the
 * message already typed and the customer taps send.
 * \n survives encodeURIComponent as %0A and renders as real line breaks.
 */
export function carEnquiryLink(car: Car): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const price = car.priceOnRequest
    ? "Price on request"
    : `₹${formatPrice(car.price)}`;

  const text = [
    "Hey! I was looking at your website.",
    "",
    "I want to enquire about:",
    car.title,
    price,
    `${siteUrl()}/cars/${car.slug}`,
    "",
    "Can you share more details about this?",
  ].join("\n");

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** Generic enquiry, for the listing page header / teaser CTA. */
export function generalEnquiryLink(): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const text =
    "Hey! I was looking at the cars on your website. Can you share more details?";
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** The enquiry number, digits only. One source of truth for wa.me and tel:. */
export const enquiryNumber = () =>
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

/** Pretty form of the same number, for display: +91 92155 93793. */
export function enquiryNumberDisplay(): string {
  const n = enquiryNumber();
  const m = /^(\d{2})(\d{5})(\d{5})$/.exec(n);
  return m ? `+${m[1]} ${m[2]} ${m[3]}` : n ? `+${n}` : "";
}

export type AppointmentFields = {
  name: string;
  phone: string;
  email?: string;
  vehicle?: string;
  notes?: string;
};

/**
 * Appointment request from the booking form, routed down the same click-to-chat
 * path as a car enquiry — so a lead lands on the one number the workshop
 * already watches, with no inbox, no form backend and nothing to keep running.
 *
 * Optional fields are dropped rather than sent empty: a message reading
 * "Email:" with nothing after it looks like a broken form, not a lead.
 */
export function appointmentLink(f: AppointmentFields): string {
  const text = [
    "Hey! I'd like to book an appointment.",
    "",
    `Name: ${f.name}`,
    `Phone: ${f.phone}`,
    f.email?.trim() ? `Email: ${f.email.trim()}` : null,
    f.vehicle?.trim() ? `Vehicle: ${f.vehicle.trim()}` : null,
    f.notes?.trim() ? `\nWhat I need:\n${f.notes.trim()}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");

  return `https://wa.me/${enquiryNumber()}?text=${encodeURIComponent(text)}`;
}
