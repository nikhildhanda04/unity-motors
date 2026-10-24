"use client";

import { useState } from "react";
import { MAX_QTY } from "@/lib/cart";
import { formatPrice, type Product } from "@/lib/types";
import { useCart } from "./cart";
import { Cart as CartIcon, Minus, Plus } from "./icons";

/**
 * Variant picker, quantity, and the add button. Nothing is preselected when a
 * product has variants — a default gets bought by accident, and a coilover for
 * the wrong car is an expensive accident.
 */
export default function AddToCart({ product }: { product: Product }) {
  const { add, setOpen } = useCart();
  const [variant, setVariant] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  const hasVariants = product.variants.length > 0;
  const chosen = product.variants.find((v) => v.name === variant);
  const price = chosen ? chosen.price : product.price;
  const blocked = !product.inStock || (hasVariants && !chosen);

  function handleAdd() {
    if (blocked) return;
    add({
      slug: product.slug,
      title: product.title,
      variant: chosen?.name ?? null,
      price,
      qty,
      image: product.images[0]?.url ?? null,
    });
    // Opening the drawer is the confirmation: without it, on a long product
    // page, nothing visibly happens when you tap Add.
    setOpen(true);
  }

  const step =
    "w-10 h-10 grid place-items-center border border-[#23292d] text-gray-400 hover:text-white hover:border-[#E43E3D] transition-colors disabled:opacity-30 disabled:hover:border-[#23292d] disabled:hover:text-gray-400";

  return (
    <div className="space-y-7">
      {hasVariants && (
        <div>
          <span className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.18em] mb-3 block">
            Choose one
          </span>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.name}
                onClick={() => setVariant(v.name)}
                aria-pressed={v.name === variant}
                className={`px-4 py-3 border text-sm font-bold transition-colors ${
                  v.name === variant
                    ? "border-[#E43E3D] bg-[#E43E3D]/10 text-white"
                    : "border-[#23292d] text-gray-400 hover:border-gray-600 hover:text-white"
                }`}
              >
                {v.name}
                <span className="tnum block text-[12px] font-medium mt-0.5 opacity-70">
                  ₹{formatPrice(v.price)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} className={step} aria-label="Reduce quantity">
            <Minus className="w-4 h-4" />
          </button>
          <span className="tnum w-10 text-center text-white font-black text-lg">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} disabled={qty >= MAX_QTY} className={step} aria-label="Increase quantity">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {(chosen || !hasVariants) && (
          <span className="tnum text-white font-black text-2xl tracking-tight">
            ₹{formatPrice(price * qty)}
          </span>
        )}
      </div>

      <button
        onClick={handleAdd}
        disabled={blocked}
        className="flex items-center justify-center gap-3 w-full sm:w-auto sm:px-12 bg-[#E43E3D] hover:bg-[#c73332] disabled:bg-[#1b2126] disabled:text-gray-500 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-widest py-4 transition-colors"
      >
        <CartIcon className="w-5 h-5" />
        {!product.inStock
          ? "Out of stock"
          : hasVariants && !chosen
            ? "Pick an option first"
            : "Add to cart"}
      </button>
    </div>
  );
}
