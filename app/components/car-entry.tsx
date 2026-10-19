import Image from "next/image";
import Link from "next/link";
import { img } from "@/lib/media";
import { formatKm, formatPrice, type Car } from "@/lib/types";
import { ArrowRight, Play } from "./icons";

/**
 * One line of the register. Not a card: no container, no rounded corners, no
 * shadow. The hairline above it and the grid columns are the whole structure,
 * which is what lets an uneven set of phone photos read as one ordered list.
 *
 * Mobile keeps the crop locked in a real left column. It must never become a
 * floating thumbnail above stacked text — that is the card reading the register
 * exists to refuse. The standalone year column is desktop-only: on mobile the
 * title already carries the year, so a second column would only leave dead
 * ground to the right of the crop.
 */
export default function CarEntry({ car, index }: { car: Car; index: number }) {
  const specs = [
    car.kmDriven ? `${formatKm(car.kmDriven)} km` : null,
    car.fuelType || null,
    car.transmission || null,
    car.ownership || null,
  ].filter(Boolean);

  // Sold rows recede through explicit colour, never opacity. opacity composites
  // over greys that are already at the 4.5:1 floor and drops them to ~2.5:1.
  const titleTone = car.sold ? "text-gray-400" : "text-white";
  const priceTone = car.sold ? "text-gray-400" : "text-white";

  return (
    <Link
      href={`/cars/${car.slug}`}
      aria-label={`${car.title}, ${
        car.priceOnRequest ? "price on request" : `₹${formatPrice(car.price)}`
      }${car.sold ? ", sold" : ""}`}
      className="group block border-t border-[#23292d] entry-rise focus-visible:outline-offset-[-2px]"
      style={{ animationDelay: `${Math.min(index, 6) * 70}ms` }}
    >
      <article className="relative grid grid-cols-[7rem_1fr] md:grid-cols-[4.5rem_12rem_1fr_auto] gap-x-4 gap-y-3 md:gap-x-8 py-5 md:py-7">
        {/* A red bar grows along the rule on hover — the register selecting a line. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-px left-0 h-px w-0 bg-[#E43E3D] transition-[width] duration-700 ease-out group-hover:w-full"
        />

        {/* Desktop-only year column; the title carries the year on mobile. */}
        <div className="tnum hidden md:block self-start text-3xl font-black text-[#6b767f] tracking-tighter leading-none transition-colors duration-500 group-hover:text-[#E43E3D] pt-1">
          {car.year || "—"}
        </div>

        <div className="relative row-span-2 md:row-span-1 self-start w-28 h-20 md:w-48 md:h-32 overflow-hidden bg-[#111]">
          {car.images[0] ? (
            <Image
              src={img(car.images[0].url, 560)}
              alt=""
              fill
              unoptimized
              sizes="(max-width: 768px) 112px, 192px"
              className={`object-cover transition-[transform,filter] duration-[900ms] ease-out ${
                car.sold
                  ? "grayscale brightness-[0.6]"
                  : "grayscale-[0.55] contrast-[1.05] group-hover:grayscale-0 group-hover:scale-[1.04]"
              }`}
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-gray-400 text-[10px] uppercase tracking-widest">
              No photo
            </div>
          )}

          {car.video && !car.sold && (
            <span className="absolute bottom-0 left-0 bg-[#E43E3D] text-white p-1.5">
              <Play className="w-3 h-3" />
            </span>
          )}
        </div>

        <div className="min-w-0 md:pt-0.5">
          <h3
            className={`text-xl sm:text-2xl md:text-[2.1rem] font-black uppercase tracking-tighter leading-[0.95] ${titleTone}`}
          >
            {car.title}
          </h3>

          {/* The argument: every car on this lot went through the workshop. */}
          <p
            className={`mt-2.5 text-[11px] font-bold uppercase tracking-[0.18em] ${
              car.sold ? "text-gray-400" : "text-[#E43E3D]"
            }`}
          >
            {car.sold ? (
              "Sold"
            ) : (
              <>
                <span className="sm:hidden">Inspected in-house</span>
                <span className="hidden sm:inline">
                  Inspected &amp; detailed in-house
                </span>
              </>
            )}
          </p>

          {specs.length > 0 && (
            <p className="tnum mt-2 text-[13px] font-medium text-gray-400">
              {specs.join("  ·  ")}
              {/* The registration state is the fifth spec, which wraps this
                  line to three ragged lines at 360px. It stays on the detail
                  page's spec list below sm, where there is room for it. */}
              {car.stateRegistered && (
                <span className="hidden sm:inline">
                  {`  ·  ${car.stateRegistered}`}
                </span>
              )}
            </p>
          )}
        </div>

        <div className="col-start-2 md:col-start-auto flex items-center justify-between md:justify-end gap-6 md:items-start md:pt-1">
          <p
            className={`tnum font-black tracking-tighter whitespace-nowrap ${priceTone} ${
              car.priceOnRequest
                ? "text-base md:text-lg font-bold tracking-normal"
                : "text-xl md:text-[1.75rem]"
            }`}
          >
            {car.priceOnRequest ? "Price on request" : `₹${formatPrice(car.price)}`}
          </p>

          <span aria-hidden className="md:hidden text-[#E43E3D]">
            <ArrowRight className="w-5 h-5" />
          </span>
        </div>
      </article>
    </Link>
  );
}
