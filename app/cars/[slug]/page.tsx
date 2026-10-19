import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/navbar";
import FooterSection from "../../components/footer";
import CarGallery from "../../components/car-gallery";
import CarEntry from "../../components/car-entry";
import { ArrowLeft, Check, WhatsApp } from "../../components/icons";
import { getCarBySlug, getCars } from "@/lib/cars";
import { img } from "@/lib/media";
import { carEnquiryLink } from "@/lib/whatsapp";
import { formatKm, formatPrice } from "@/lib/types";

export async function generateStaticParams() {
  // Never fail the build over a storage hiccup; pages still render on demand.
  const cars = await getCars().catch(() => []);
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) return { title: "Car not found | Unity Motors" };

  const price = car.priceOnRequest
    ? "Price on request"
    : `₹${formatPrice(car.price)}`;

  return {
    title: `${car.title} — ${price} | Unity Motors`,
    description:
      car.description.slice(0, 160) ||
      `${car.title} at Unity Motors, Karnal. Inspected and detailed in-house. ${price}.`,
    openGraph: {
      title: `${car.title} — ${price}`,
      description: car.description.slice(0, 200),
      images: car.images[0] ? [img(car.images[0].url, 1200)] : [],
    },
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) notFound();

  const specs = [
    { label: "Year", value: car.year ? String(car.year) : null },
    { label: "KM driven", value: car.kmDriven ? formatKm(car.kmDriven) : null },
    { label: "Fuel", value: car.fuelType || null },
    { label: "Transmission", value: car.transmission || null },
    { label: "Ownership", value: car.ownership || null },
    { label: "Registered", value: car.stateRegistered || null },
  ].filter((s) => s.value);

  const others = (await getCars())
    .filter((c) => c.id !== car.id && !c.sold)
    .slice(0, 3);

  const price = car.priceOnRequest
    ? "Price on request"
    : `₹${formatPrice(car.price)}`;

  return (
    <main className="min-h-screen bg-[#0a0f12]">
      <Navbar />

      <article className="w-full font-sans pt-10 sm:pt-14">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2.5 -ml-1 px-1 py-2.5 text-gray-400 hover:text-white text-[11px] font-bold uppercase tracking-[0.18em] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Stock
          </Link>

          {/* Title band: the car named at full display scale before anything else. */}
          <header className="mt-7 pb-8 border-b-2 border-[#E43E3D]">
            {car.sold && (
              <p className="text-gray-400 font-black text-[11px] uppercase tracking-[0.2em] mb-4">
                Sold — no longer available
              </p>
            )}
            <h1 className="text-[clamp(2.4rem,7.5vw,5rem)] font-black text-white uppercase tracking-[-0.045em] leading-[0.85] max-w-4xl">
              {car.title}
            </h1>
            <p className="mt-5 text-[#E43E3D] text-xs font-bold uppercase tracking-[0.18em]">
              Inspected &amp; detailed in our own workshop
            </p>
          </header>

          <div className="grid lg:grid-cols-[1.55fr_1fr] gap-12 lg:gap-16 mt-12">
            <div>
              <CarGallery car={car} />

              {car.description && (
                <section className="mt-12">
                  <h2 className="text-white font-black uppercase tracking-tighter text-xl mb-4">
                    About this car
                  </h2>
                  <p className="text-gray-400 font-medium text-[15px] leading-[1.75] whitespace-pre-line max-w-[68ch]">
                    {car.description}
                  </p>
                </section>
              )}
            </div>

            <div>
              <div className="lg:sticky lg:top-8">
                {/* Condition first, price second — trust leads the hierarchy. */}
                {specs.length > 0 && (
                  <dl className="border-t border-[#23292d]">
                    {specs.map((s) => (
                      <div
                        key={s.label}
                        className="flex items-baseline justify-between gap-6 py-4 border-b border-[#23292d]"
                      >
                        <dt className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.18em]">
                          {s.label}
                        </dt>
                        <dd className="tnum text-white font-bold text-[15px]">
                          {s.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                {car.features.length > 0 && (
                  <section className="mt-10">
                    <h2 className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.18em] mb-4">
                      Equipment
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-y-2.5 gap-x-6">
                      {car.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2.5 text-gray-300 text-[14px] font-medium"
                        >
                          <Check className="w-3.5 h-3.5 mt-1 shrink-0 text-[#E43E3D]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <div className="mt-10 bg-[#111] p-7 shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.18em]">
                    Asking
                  </p>
                  <p
                    className={`tnum text-white font-black tracking-tighter mt-1.5 ${
                      car.priceOnRequest
                        ? "text-2xl"
                        : "text-[clamp(2rem,5vw,2.75rem)] leading-none"
                    }`}
                  >
                    {price}
                  </p>

                  {/* Finance sits with the price because that is where it
                      changes the decision, not in the spec list. */}
                  {car.loanAvailable && (
                    <p className="mt-3 flex items-center gap-2 text-[#E43E3D] text-[11px] font-bold uppercase tracking-[0.18em]">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      Loan facility available
                    </p>
                  )}

                  {/*
                    The whole enquiry feature: a wa.me link. WhatsApp opens with
                    this car already named; the customer taps send.
                  */}
                  <a
                    href={carEnquiryLink(car)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-center justify-center gap-3 w-full bg-[#E43E3D] hover:bg-[#c7322f] text-white font-black text-sm uppercase tracking-widest py-4.5 px-6 transition-colors"
                  >
                    <WhatsApp className="w-5 h-5" />
                    Enquire on WhatsApp
                  </a>
                  <p className="text-gray-400 text-[11px] text-center mt-3.5 leading-relaxed">
                    Opens WhatsApp with this car&apos;s details filled in.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {others.length > 0 && (
            <section className="mt-28">
              <h2 className="text-gray-400 font-black text-xs uppercase tracking-[0.2em] mb-6">
                Also on the floor
              </h2>
              {others.map((c, i) => (
                <CarEntry key={c.id} car={c} index={i} />
              ))}
            </section>
          )}
        </div>
      </article>

      <div className="mt-24">
        <FooterSection />
      </div>

      {/* Mobile: the action stays reachable with one thumb, never scrolled past. */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0a0f12]/95 backdrop-blur border-t border-[#23292d] px-4 py-3 flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.18em]">
            Asking
          </p>
          <p className="tnum text-white font-black text-lg tracking-tighter truncate">
            {price}
          </p>
        </div>
        <a
          href={carEnquiryLink(car)}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2.5 bg-[#E43E3D] hover:bg-[#c7322f] text-white font-black text-xs uppercase tracking-widest py-3.5 px-6 transition-colors"
        >
          <WhatsApp className="w-4 h-4" />
          Enquire
        </a>
      </div>
      {/* Spacer so the fixed bar never covers the footer's last line. */}
      <div aria-hidden className="lg:hidden h-20" />
    </main>
  );
}
