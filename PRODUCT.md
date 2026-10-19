# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Car buyers in and around Karnal, Haryana.** Overwhelmingly on a phone, often arriving from a WhatsApp forward or an Instagram post rather than a search. They are cross-shopping the same cars on OLX, CarDekho and Cars24, where every listing looks identical and nobody can tell a reconditioned car from a neglected one. Their real question is not "what does it cost" but "can I trust this one."

**The owner, managing stock through `/admin`.** Uses it a few times a week — adding a car that just landed, marking one sold, pulling one down. Works from a phone or a laptop in the workshop, not a desk. Needs to see current stock at a glance and change one thing quickly; this is a tool, not a showcase.

## Product Purpose

Unity Motors is an established car detailing and modification workshop that also sells used cars. The site exists to make those cars enquirable: a buyer browses stock, opens a car, and reaches WhatsApp with that specific car already named in the message. Success is an enquiry arriving on the owner's phone with enough context to reply without asking "which car?"

## Positioning

**The cars are prepared by the same workshop that sells them.** Unity Motors does ceramic coating, PPF, detailing, ECU remapping and suspension work as its primary business — so a car on this lot has been inspected and reconditioned in-house before listing. A classifieds site and a pure dealer cannot truthfully claim this; it is the one thing that separates these listings from the identical grid on OLX. Confirmed by the user as the reason buyers enquire: **trust and condition lead, price is stated plainly but is not the hook.**

## Operating Context

- Enquiry runs entirely over **WhatsApp click-to-chat** (`wa.me`). No contact forms, no lead capture, no CRM. The customer initiates; the business never messages first.
- Enquiries land on **+91 92155 93793**. The workshop's published line is **+91 77107 77775**.
- Premises: near Nishan Public School, Karnal, Niawal, Haryana 132001. Hours 09:00–18:00, Mon–Fri.
- Domain: `unitymotors.in`.
- The car sales section sits inside an existing single-page detailing site; navbar, footer and the homepage sections are shared and out of scope for changes.

## Capabilities and Constraints

- **Stack:** Next.js 16 (App Router), React 19, Tailwind v4 (CSS-first, no config file), Prisma 7 + Neon Postgres, Cloudinary for media, deployed on Vercel.
- **Photography is phone photos taken on the lot** — confirmed by the user. Inconsistent lighting, varied angles, cluttered backgrounds. The design must make a mismatched set cohere; it cannot assume a shot catalogue.
- Each car carries: title, price (or "price on request"), year, km, fuel, transmission, ownership, description, a features list, multiple photos, an optional video, plus sold/featured flags.
- Video is uploaded directly and must stay `preload="none"` with a poster frame — free-tier bandwidth depends on no video bytes loading until play is pressed.
- `/admin` is protected by a single phone-plus-password login. One account, no roles.
- Free tiers throughout (Neon ~0.5GB, Cloudinary ~25GB). Nothing may assume paid capacity.
- Tailwind v4 `@theme` tokens exist (`--color-primary: #FF9500`) but are **unused and misleading**; the real accent is `#E43E3D`, hardcoded throughout.

## Brand Commitments

- Name **Unity Motors**; logo at `/public/logo.jpeg`.
- Accent red **#E43E3D** (deeper variant `#A32A29`), near-black grounds (`#0a0f12`, `#111111`, `black`).
- Voice is blunt, confident, working-garage — not luxury-dealer and not salesy.
- The navbar is a centred wordmark with no navigation links; the footer carries wayfinding.

## Evidence on Hand

- ~47 photographs in `/public` of real cars and real work at the premises.
- A published claim of **12+ years experience** and a service catalogue (detailing, ceramic, PPF, ECU remap, air suspension, 3D-printed OEM parts) already live on the site.
- A real Google Maps location and two real phone numbers.
- **Absent and not to be invented:** customer testimonials, review scores, cars-sold counts, inspection certifications, warranty terms, finance offers, delivery claims, any price not entered by the owner. Demo listings must be labelled as such.

## Product Principles

1. **Condition is the argument.** Every surface should make the in-house preparation legible; it is the only claim competitors cannot copy.
2. **The layout carries the photo, not the reverse.** Assume an imperfect phone snapshot and design framing that still looks deliberate.
3. **One action, always reachable: enquire on WhatsApp**, carrying the car's identity with it.
4. **Selling and managing are different jobs.** Public surfaces persuade; `/admin` is a dense tool where scanning speed beats expression.
5. **Never fabricate trust.** No invented ratings, counts or certifications — the workshop's actual work is the proof.

## Accessibility & Inclusion

Mobile-first is the real usage scene, not a breakpoint afterthought. Enquiry must work with one thumb. Contrast must hold on dark grounds in daylight, since buyers browse outdoors and in the workshop.
