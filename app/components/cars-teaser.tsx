import Link from "next/link";
import CarEntry from "./car-entry";
import { ArrowRight } from "./icons";
import { getCars } from "@/lib/cars";

/**
 * Homepage strip of the register. Renders nothing when there are no cars, so
 * the site never shows an empty "Cars For Sale" section.
 */
export default async function CarsTeaserSection() {
  const cars = await getCars();
  const available = cars.filter((c) => !c.sold);
  if (available.length === 0) return null;

  const featured = available.filter((c) => c.featured);
  const show = (featured.length > 0 ? featured : available).slice(0, 3);

  return (
    <section
      id="cars"
      className="w-full bg-[#0a0f12] py-24 sm:py-32 font-sans border-t border-gray-900"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 pb-8">
          <h2 className="text-[clamp(2.75rem,9vw,5.5rem)] font-black text-white uppercase tracking-[-0.045em] leading-[0.8]">
            Cars For Sale
          </h2>
          <p className="tnum text-gray-400 text-[13px] font-medium pb-2 md:text-right">
            {available.length} available now
            <span className="block text-[#E43E3D] font-bold uppercase tracking-[0.18em] text-[11px] mt-1.5">
              Prepared in our own workshop
            </span>
          </p>
        </div>

        <p className="max-w-xl text-gray-400 font-medium leading-relaxed text-[15px] pb-10">
          We sell the cars we prepare. Every one is inspected, corrected and
          detailed here before it reaches the floor.
        </p>

        <div className="border-t-2 border-[#E43E3D] border-b border-[#23292d]">
          {show.map((car, i) => (
            <CarEntry key={car.id} car={car} index={i} />
          ))}
        </div>

        <div className="border-t border-[#23292d] pt-8">
          <Link
            href="/cars"
            className="group inline-flex items-center gap-3 text-white hover:text-[#E43E3D] font-black text-sm uppercase tracking-widest transition-colors"
          >
            See the full register
            <ArrowRight className="w-5 h-5 transition-transform duration-500 ease-out group-hover:translate-x-1.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
