import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/navbar";
import FooterSection from "../components/footer";
import ProductCard from "../components/product-card";
import { WhatsApp } from "../components/icons";
import { getProducts } from "@/lib/products";
import { generalEnquiryLink } from "@/lib/whatsapp";
import { PRODUCT_CATEGORIES } from "@/lib/types";

export const metadata: Metadata = {
  title: "Parts Store | Unity Motors",
  description:
    "Performance parts, exhausts, suspension and detailing supplies from Unity Motors, Karnal. Order on WhatsApp.",
};

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = await getProducts();

  // Built from the products themselves, not from PRODUCT_CATEGORIES: the admin
  // can type a new category, and one that exists but has no chip is invisible.
  // Seeded categories keep their canonical order; anything new follows, sorted.
  const used = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const live = [
    ...PRODUCT_CATEGORIES.filter((c) => used.includes(c)),
    ...used.filter((c) => !PRODUCT_CATEGORIES.includes(c)).sort(),
  ];
  const shown = category
    ? products.filter((p) => p.category === category)
    : products;

  const chip =
    "px-4 py-2.5 border text-[11px] font-bold uppercase tracking-[0.18em] transition-colors";

  return (
    <main className="min-h-screen bg-[#0a0f12]">
      <Navbar />

      <section className="w-full font-sans pt-9 sm:pt-20 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 pb-5">
            <h1 className="text-[clamp(3.5rem,13vw,7.5rem)] font-black text-white uppercase tracking-[-0.045em] leading-[0.8]">
              Store
            </h1>
            <p className="tnum text-gray-400 text-[13px] font-medium pb-2 md:text-right">
              {products.length} {products.length === 1 ? "part" : "parts"} listed
              <span className="block text-[#E43E3D] font-bold uppercase tracking-[0.18em] text-[11px] mt-1.5">
                Fitted here if you want
              </span>
            </p>
          </header>

          <p className="max-w-xl text-gray-400 font-medium leading-relaxed text-[14px] sm:text-[15px] pb-7 sm:pb-10">
            Parts we fit ourselves. Add what you need to the cart and send the
            list over WhatsApp — we confirm stock, final price and fitting
            before anything is paid for.
          </p>

          {products.length === 0 ? (
            <div className="py-28 border-t border-[#23292d]">
              <p className="text-white font-black uppercase tracking-tighter text-3xl sm:text-4xl leading-none max-w-lg">
                The counter is still being stocked
              </p>
              <p className="text-gray-400 text-[15px] mt-5 mb-9 max-w-md leading-relaxed">
                Tell us what you are after and we will source it — most of what
                we fit never makes it onto a shelf.
              </p>
              <a
                href={generalEnquiryLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#E43E3D] hover:bg-[#c7322f] text-white font-black text-xs uppercase tracking-widest py-4 px-8 transition-colors"
              >
                <WhatsApp className="w-4 h-4" />
                Ask us to source it
              </a>
            </div>
          ) : (
            <>
              {live.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-8 -mx-6 px-6 lg:mx-0 lg:px-0 lg:flex-wrap">
                  <Link
                    href="/store"
                    className={`${chip} shrink-0 ${
                      !category
                        ? "border-[#E43E3D] bg-[#E43E3D]/10 text-white"
                        : "border-[#23292d] text-gray-400 hover:text-white hover:border-gray-600"
                    }`}
                  >
                    All
                  </Link>
                  {live.map((c) => (
                    <Link
                      key={c}
                      href={`/store?category=${encodeURIComponent(c)}`}
                      className={`${chip} shrink-0 ${
                        category === c
                          ? "border-[#E43E3D] bg-[#E43E3D]/10 text-white"
                          : "border-[#23292d] text-gray-400 hover:text-white hover:border-gray-600"
                      }`}
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              )}

              <div className="border-t-2 border-[#E43E3D] pt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {shown.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              <div className="border-t border-[#23292d] mt-20 pt-14 flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                <p className="text-white font-black uppercase tracking-tighter text-2xl sm:text-3xl leading-[0.95] max-w-sm">
                  Can&apos;t find
                  <br />
                  the part?
                </p>
                <a
                  href={generalEnquiryLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-3 bg-[#E43E3D] hover:bg-[#c7322f] text-white font-black text-xs uppercase tracking-widest py-4 px-8 transition-colors"
                >
                  <WhatsApp className="w-4 h-4" />
                  Ask us to source it
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
