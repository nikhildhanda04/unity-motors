"use client";

import Image from "next/image";
import Link from "next/link";
import { lineKey } from "@/lib/cart";
import { img } from "@/lib/media";
import { formatPrice, productPrice, type Product } from "@/lib/types";
import { useCart } from "./cart";
import { Cart as CartIcon, Check } from "./icons";

/**
 * Grid cell on /store and in the homepage teaser.
 *
 * A part sold one way is added straight from the grid — that is the whole
 * point of a store. A part with options cannot be, because adding one would
 * mean picking a fitment on the customer's behalf, so its button sends them to
 * the product page to choose.
 */
export default function ProductCard({ product }: { product: Product }) {
  const { lines, add, setOpen } = useCart();
  const { from, amount } = productPrice(product);

  const hasOptions = product.variants.length > 0;
  const inCart = lines.find(
    (l) => lineKey(l) === lineKey({ slug: product.slug, variant: null }),
  );

  function addDirect() {
    add({
      slug: product.slug,
      title: product.title,
      variant: null,
      price: product.price,
      qty: 1,
      image: product.images[0]?.url ?? null,
    });
    setOpen(true);
  }

  const action =
    "flex items-center justify-center gap-2 w-full py-3.5 font-black text-[11px] uppercase tracking-widest transition-colors";

  return (
    <div className="group flex flex-col bg-[#0e1316] border border-[#1b2126] hover:border-[#E43E3D] transition-colors">
      <Link href={`/store/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#0a0f12]">
          {product.images[0] && (
            <Image
              src={img(product.images[0].url, 700)}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
                product.inStock ? "" : "opacity-40 grayscale"
              }`}
            />
          )}
          {!product.inStock && (
            <span className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1.5">
              Out of stock
            </span>
          )}
        </div>

        <div className="px-5 pt-5 pb-4">
          {product.category && (
            <span className="block text-[#E43E3D] font-bold uppercase tracking-[0.18em] text-[10px] mb-2">
              {product.category}
            </span>
          )}
          <h3 className="text-white font-black uppercase tracking-tight text-[15px] leading-tight">
            {product.title}
          </h3>
        </div>
      </Link>

      {/* mt-auto pins the price and button to the bottom, so cards in a row
          line up however long their titles run. */}
      <div className="mt-auto px-5 pb-5">
        <p className="tnum text-white font-bold text-lg mb-4">
          {from && <span className="text-gray-500 font-medium text-sm mr-1">from</span>}
          ₹{formatPrice(amount)}
        </p>

        {!product.inStock ? (
          <span className={`${action} bg-[#15191c] text-gray-500 cursor-not-allowed`}>
            Out of stock
          </span>
        ) : hasOptions ? (
          <Link
            href={`/store/${product.slug}`}
            className={`${action} border border-[#23292d] text-gray-300 hover:border-[#E43E3D] hover:text-white`}
          >
            Choose an option
          </Link>
        ) : (
          <button
            onClick={addDirect}
            className={`${action} ${
              inCart
                ? "bg-[#1b2126] text-white hover:bg-[#23292d]"
                : "bg-[#E43E3D] text-white hover:bg-[#c73332]"
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-4 h-4" />
                In cart · {inCart.qty}
              </>
            ) : (
              <>
                <CartIcon className="w-4 h-4" />
                Add to cart
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
