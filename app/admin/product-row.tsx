"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { removeProduct, toggleInStock, toggleProductFeatured } from "./actions";
import { img } from "@/lib/media";
import { formatPrice, productPrice, type Product } from "@/lib/types";
import { Check, Pencil, Star, Trash } from "../components/icons";

/** One scannable line per product. Same density and affordances as CarRow. */
export default function ProductRow({ product }: { product: Product }) {
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const { from, amount } = productPrice(product);

  const meta = [
    product.category || null,
    product.variants.length
      ? `${product.variants.length} option${product.variants.length === 1 ? "" : "s"}`
      : null,
    `${product.images.length} photo${product.images.length === 1 ? "" : "s"}`,
  ]
    .filter(Boolean)
    .join("  ·  ");

  const action =
    "inline-flex items-center gap-1.5 p-2.5 sm:px-2.5 sm:py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-[#1b2126] transition-colors disabled:opacity-40";

  return (
    <div
      className={`border-b border-[#1b2126] transition-opacity ${pending ? "opacity-40" : ""}`}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2.5 hover:bg-[#0e1316] transition-colors">
        <div className="relative w-14 h-10 shrink-0 overflow-hidden bg-[#15191c]">
          {product.images[0] ? (
            <Image
              src={img(product.images[0].url, 160)}
              alt=""
              fill
              unoptimized
              sizes="56px"
              className={`object-cover ${product.inStock ? "" : "grayscale"}`}
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-[10px] text-gray-400 uppercase">
              None
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2.5">
            <h3 className="text-white font-semibold text-[14px] truncate">
              {product.title}
            </h3>
            {product.featured && <Star className="w-3 h-3 shrink-0 text-[#E43E3D]" />}
          </div>
          <p className="tnum text-gray-400 text-[11.5px] mt-0.5 truncate">
            <span className="text-gray-300 font-semibold">
              {from && "from "}₹{formatPrice(amount)}
            </span>
            {meta && `  ·  ${meta}`}
          </p>
        </div>

        <span
          className={`shrink-0 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider tabular-nums ${
            product.inStock ? "text-emerald-400" : "text-gray-400"
          }`}
        >
          <span
            aria-hidden
            className={`w-1.5 h-1.5 ${product.inStock ? "bg-emerald-400" : "bg-gray-500"}`}
          />
          {product.inStock ? "In stock" : "Out"}
        </span>

        {confirming ? (
          <div className="flex items-center gap-2 basis-full justify-end sm:basis-auto sm:ml-auto">
            <span className="text-gray-400 text-[11px] hidden sm:inline">
              Delete photos too?
            </span>
            <button onClick={() => setConfirming(false)} className={action}>
              Cancel
            </button>
            <button
              onClick={() => start(() => removeProduct(product.id))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider bg-[#E43E3D] text-white hover:bg-[#c7322f] transition-colors"
            >
              <Trash className="w-3 h-3" />
              Delete
            </button>
          </div>
        ) : (
          <div className="flex items-center basis-full justify-end sm:basis-auto sm:ml-auto">
            <button
              onClick={() => start(() => toggleProductFeatured(product.id))}
              disabled={pending}
              title={product.featured ? "Remove from homepage" : "Show on homepage"}
              className={`${action} ${product.featured ? "text-[#E43E3D]" : ""}`}
            >
              <Star className="w-3.5 h-3.5" />
              <span className="sr-only">{product.featured ? "Unfeature" : "Feature"}</span>
            </button>
            <button
              onClick={() => start(() => toggleInStock(product.id))}
              disabled={pending}
              className={action}
            >
              <Check className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {product.inStock ? "Out" : "In"}
              </span>
              <span className="sr-only sm:hidden">
                {product.inStock ? "Mark out of stock" : "Mark in stock"}
              </span>
            </button>
            <Link href={`/admin/product/${product.id}`} className={action}>
              <Pencil className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
              <span className="sr-only sm:hidden">Edit</span>
            </Link>
            <button
              onClick={() => setConfirming(true)}
              disabled={pending}
              className={`${action} hover:text-[#E43E3D]`}
            >
              <Trash className="w-3.5 h-3.5" />
              <span className="sr-only">Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
