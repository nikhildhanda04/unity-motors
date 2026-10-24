import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "./icons";
import { img } from "@/lib/media";
import { getProducts } from "@/lib/products";
import { formatPrice, productPrice } from "@/lib/types";

/**
 * Homepage strip of the parts counter. Renders nothing when there are no
 * products, so the site never shows an empty store section — and never shows
 * the old "Coming Soon" placeholder once the store is actually stocked.
 */
export const ShopTeaserSection = async () => {
  const products = await getProducts();
  const live = products.filter((p) => p.inStock);
  if (live.length === 0) return null;

  const featured = live.filter((p) => p.featured);
  const show = (featured.length > 0 ? featured : live).slice(0, 3);

  return (
    <section className="w-full bg-[#0a0f12] py-24 sm:py-32 font-sans relative overflow-hidden border-t border-gray-900">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-[#111] to-transparent z-0 opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="flex flex-col items-start text-left">
            <span className="text-[#E43E3D] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-6 py-1.5 px-4 border border-[#E43E3D]/30 rounded-full bg-[#E43E3D]/10 shadow-[0_0_15px_rgba(228,62,61,0.2)]">
              Now stocked
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">
              Exclusive Parts <br />
              <span className="text-gray-400">Store</span>
            </h2>
            <div className="w-16 h-1 bg-[#E43E3D] mb-4"></div>
            <p className="text-gray-400 font-medium leading-relaxed max-w-xl">
              The same parts we fit in our own shop. Add what you need to the
              cart and send the list over WhatsApp — we confirm stock, final
              price and fitting before anything is paid for.
            </p>
          </div>

          <Link
            href="/store"
            className="group shrink-0 inline-flex items-center gap-3 bg-[#E43E3D] hover:bg-[#c7322f] text-white font-black text-xs uppercase tracking-widest py-3.5 px-8 rounded-full transition-colors"
          >
            Browse the store
            <ArrowRight className="w-4 h-4 transition-transform duration-500 ease-out group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
          {show.map((p) => {
            const { from, amount } = productPrice(p);
            return (
              <Link key={p.id} href={`/store/${p.slug}`} className="group flex flex-col items-center">
                <div className="w-full h-80 sm:h-105 relative overflow-hidden rounded-2xl bg-[#0e1418] border border-gray-800/80 shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:border-red-900/40 transition-colors duration-500">
                  <div className="absolute inset-0 bg-linear-to-t from-[#0a0f12] via-[#0a0f12]/40 to-transparent opacity-90 z-10 transition-opacity duration-500 group-hover:opacity-60"></div>

                  {p.images[0] && (
                    <Image
                      src={img(p.images[0].url, 800)}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out grayscale-[0.4] group-hover:grayscale-0"
                    />
                  )}

                  <div className="absolute bottom-6 left-6 right-6 z-20 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                    {p.category && (
                      <span className="text-[#E43E3D] font-bold text-[10px] uppercase tracking-widest mb-2 block">
                        {p.category}
                      </span>
                    )}
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                      {p.title}
                    </h3>
                    <p className="tnum text-gray-300 font-bold text-sm mt-2">
                      {from && <span className="text-gray-500 font-medium mr-1">from</span>}
                      ₹{formatPrice(amount)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShopTeaserSection;
