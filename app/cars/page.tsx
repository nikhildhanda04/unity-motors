import type { Metadata } from "next";
import Navbar from "../components/navbar";
import FooterSection from "../components/footer";
import CarEntry from "../components/car-entry";
import { WhatsApp } from "../components/icons";
import { getCars } from "@/lib/cars";
import { generalEnquiryLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Stock | Unity Motors",
  description:
    "Used cars inspected and detailed in-house at Unity Motors, Karnal. Enquire on WhatsApp.",
};

export default async function CarsPage() {
  const cars = await getCars();
  const available = cars.filter((c) => !c.sold);
  const sold = cars.filter((c) => c.sold);

  return (
    <main className="min-h-screen bg-[#0a0f12]">
      <Navbar />

      <section className="w-full font-sans pt-9 sm:pt-20 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          {/* Masthead. No eyebrow: the word carries its own weight. */}
          <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 pb-5">
            <h1 className="text-[clamp(3.5rem,13vw,7.5rem)] font-black text-white uppercase tracking-[-0.045em] leading-[0.8]">
              Stock
            </h1>

            <p className="tnum text-gray-400 text-[13px] font-medium pb-2 md:text-right">
              {available.length} available
              {sold.length > 0 && ` · ${sold.length} sold`}
              <span className="block text-[#E43E3D] font-bold uppercase tracking-[0.18em] text-[11px] mt-1.5">
                Prepared in our own workshop
              </span>
            </p>
          </header>

          <p className="max-w-xl text-gray-400 font-medium leading-relaxed text-[14px] sm:text-[15px] pb-7 sm:pb-10">
            Every car here is inspected, corrected and detailed by the same
            workshop that sells it — the ceramic, PPF and mechanical work
            happens under this roof before a car is listed.
          </p>

          {cars.length === 0 ? (
            <div className="py-28 border-t border-[#23292d]">
              <p className="text-white font-black uppercase tracking-tighter text-3xl sm:text-4xl leading-none max-w-lg">
                Nothing on the floor right now
              </p>
              <p className="text-gray-400 text-[15px] mt-5 mb-9 max-w-md leading-relaxed">
                Stock moves quickly and new cars are prepared continuously.
                Message us and we&apos;ll tell you what&apos;s coming in.
              </p>
              <a
                href={generalEnquiryLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#E43E3D] hover:bg-[#c7322f] text-white font-black text-xs uppercase tracking-widest py-4 px-8 transition-colors"
              >
                <WhatsApp className="w-4 h-4" />
                Ask what&apos;s coming in
              </a>
            </div>
          ) : (
            <>
              <div className="border-t-2 border-[#E43E3D] border-b border-[#23292d]">
                {/* The register declares its columns. Desktop only: on mobile the
                    crop and title carry the same order without a header. */}
                <div
                  aria-hidden
                  className="hidden md:grid grid-cols-[4.5rem_12rem_1fr_auto] gap-x-8 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400"
                >
                  <span>Year</span>
                  <span>Photo</span>
                  <span>Car &amp; preparation</span>
                  <span className="text-right">Asking</span>
                </div>
                {available.map((car, i) => (
                  <CarEntry key={car.id} car={car} index={i} />
                ))}
              </div>

              {sold.length > 0 && (
                <div className="mt-24">
                  <h2 className="text-gray-400 font-black text-xs uppercase tracking-[0.2em] mb-1">
                    Recently sold
                  </h2>
                  <p className="text-gray-400 text-[13px] mb-6">
                    Kept on the register so you can see what moves through here.
                  </p>
                  {sold.map((car, i) => (
                    <CarEntry key={car.id} car={car} index={i} />
                  ))}
                </div>
              )}

              <div className="border-t border-[#23292d] mt-20 pt-14 flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                <p className="text-white font-black uppercase tracking-tighter text-2xl sm:text-3xl leading-[0.95] max-w-sm">
                  Looking for something
                  <br />
                  not on the list?
                </p>
                <a
                  href={generalEnquiryLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-3 bg-[#E43E3D] hover:bg-[#c7322f] text-white font-black text-xs uppercase tracking-widest py-4 px-8 transition-colors"
                >
                  <WhatsApp className="w-4 h-4" />
                  Tell us what you want
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
