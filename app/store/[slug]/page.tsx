import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/navbar";
import FooterSection from "../../components/footer";
import ProductGallery from "../../components/product-gallery";
import ProductCard from "../../components/product-card";
import AddToCart from "../../components/add-to-cart";
import { ArrowLeft } from "../../components/icons";
import { getProductBySlug, getProducts } from "@/lib/products";
import { img } from "@/lib/media";
import { formatPrice, productPrice } from "@/lib/types";

export async function generateStaticParams() {
  // Never fail the build over a storage hiccup; pages still render on demand.
  const products = await getProducts().catch(() => []);
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Part not found | Unity Motors" };

  const { from, amount } = productPrice(product);
  const price = `${from ? "from " : ""}₹${formatPrice(amount)}`;

  return {
    title: `${product.title} — ${price} | Unity Motors`,
    description:
      product.description.slice(0, 160) ||
      `${product.title} at Unity Motors, Karnal. ${price}.`,
    openGraph: {
      title: `${product.title} — ${price}`,
      description: product.description.slice(0, 200),
      images: product.images[0] ? [img(product.images[0].url, 1200)] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const { from, amount } = productPrice(product);
  const others = (await getProducts())
    .filter((p) => p.id !== product.id && p.inStock)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#0a0f12]">
      <Navbar />

      <section className="w-full font-sans pt-9 sm:pt-16 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <Link
            href="/store"
            className="group inline-flex items-center gap-2.5 text-gray-400 hover:text-white font-bold text-[11px] uppercase tracking-[0.18em] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-500 ease-out group-hover:-translate-x-1" />
            All parts
          </Link>

          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-start">
            <ProductGallery images={product.images} title={product.title} />

            <div>
              {product.category && (
                <span className="block text-[#E43E3D] font-bold uppercase tracking-[0.18em] text-[11px] mb-4">
                  {product.category}
                </span>
              )}

              <h1 className="text-[clamp(2rem,6vw,3.25rem)] font-black text-white uppercase tracking-[-0.04em] leading-[0.9]">
                {product.title}
              </h1>

              <p className="tnum text-white font-black text-2xl tracking-tight mt-6 pb-7 border-b border-[#23292d]">
                {from && <span className="text-gray-500 font-medium text-base mr-1.5">from</span>}
                ₹{formatPrice(amount)}
              </p>

              {product.description && (
                <p className="text-gray-400 font-medium leading-[1.8] text-[15px] py-7 whitespace-pre-line">
                  {product.description}
                </p>
              )}

              <div className={product.description ? "" : "pt-7"}>
                <AddToCart product={product} />
              </div>
            </div>
          </div>

          {others.length > 0 && (
            <div className="mt-24">
              <h2 className="text-gray-400 font-black text-xs uppercase tracking-[0.2em] mb-6">
                Also on the counter
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {others.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
