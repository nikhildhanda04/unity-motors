"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { saveProduct, type SaveState } from "../../actions";
import { uploadToCloudinary } from "@/lib/upload";
import PhotoCropper from "../../car/[id]/photo-cropper";
import { img } from "@/lib/media";
import { heading, input, label, panel } from "../../ui";
import { ArrowLeft, ArrowRight, Close, Plus, Trash } from "../../../components/icons";
import {
  PRODUCT_CATEGORIES,
  type Media,
  type Product,
  type Variant,
} from "@/lib/types";

/** A variant row the owner is still typing: price is a string until saved. */
type Draft = { name: string; price: string };

const NEW = "__new__";

export default function ProductForm({
  product,
  used,
}: {
  product: Product | null;
  used: string[];
}) {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(
    saveProduct,
    {},
  );

  const [images, setImages] = useState<Media[]>(product?.images ?? []);
  const [variants, setVariants] = useState<Draft[]>(
    product?.variants.map((v) => ({ name: v.name, price: String(v.price) })) ?? [],
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const dragIndex = useRef<number | null>(null);
  const [toCrop, setToCrop] = useState<File[]>([]);

  // Seeded categories first, then anything the owner has typed since.
  const categories = [
    ...PRODUCT_CATEGORIES,
    ...used.filter((c) => !PRODUCT_CATEGORIES.includes(c)).sort(),
  ];
  // Only one of the select and the text input is ever mounted, so exactly one
  // field named "category" is submitted.
  const [typing, setTyping] = useState(false);

  // With options, the base price is never what anyone pays — showing both
  // fields would mean keeping two numbers in sync for no benefit.
  const hasVariants = variants.length > 0;

  const parsed: Variant[] = variants.map((v) => ({
    name: v.name,
    price: Number(v.price) || 0,
  }));

  async function handleImages(files: File[]) {
    if (!files.length) return;
    setUploadError(null);
    try {
      for (let i = 0; i < files.length; i++) {
        setBusy(`Uploading photo ${i + 1} of ${files.length}…`);
        setProgress(0);
        const media = await uploadToCloudinary(files[i], "image", setProgress);
        setImages((prev) => [...prev, media]);
      }
    } catch (err) {
      setUploadError((err as Error).message);
    } finally {
      setBusy(null);
      setProgress(0);
    }
  }

  /** Reorder. Index 0 is the cover photo. */
  function move(from: number, to: number) {
    if (from === to || to < 0) return;
    setImages((prev) => {
      if (to >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function drop(to: number) {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null) return;
    move(from, to);
  }

  const setDraft = (i: number, patch: Partial<Draft>) =>
    setVariants((prev) => prev.map((v, n) => (n === i ? { ...v, ...patch } : v)));

  const thumbBtn =
    "grid place-items-center h-9 flex-1 border border-[#23292d] text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-[#23292d] transition-colors";

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <input type="hidden" name="id" value={product?.id ?? "new"} />
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="variants" value={JSON.stringify(parsed)} />

      {/* ---------- Details ---------- */}
      <section className={panel}>
        <h2 className={heading}>Details</h2>

        <div className="flex flex-col gap-6">
          <div>
            <label className={label} htmlFor="title">
              Title *
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={product?.title}
              placeholder="Titanium Exhaust Tips"
              className={input}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={label} htmlFor="category">
                Category
              </label>
              {typing ? (
                <div className="flex gap-3">
                  <input
                    id="category"
                    name="category"
                    autoFocus
                    placeholder="Brakes & Cooling"
                    className={`${input} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => setTyping(false)}
                    className="shrink-0 px-4 border border-[#23292d] text-gray-400 hover:text-white hover:border-gray-600 text-[11px] font-bold uppercase tracking-wider transition-colors"
                  >
                    Pick one
                  </button>
                </div>
              ) : (
                <select
                  id="category"
                  name="category"
                  defaultValue={product?.category ?? ""}
                  onChange={(e) => {
                    if (e.target.value === NEW) setTyping(true);
                  }}
                  className={input}
                >
                  <option value="">—</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value={NEW}>+ New category…</option>
                </select>
              )}
            </div>

            <div>
              <label className={label} htmlFor="slug">
                URL slug
              </label>
              <input
                id="slug"
                name="slug"
                defaultValue={product?.slug}
                placeholder="auto-generated from title"
                className={input}
              />
              <p className="text-gray-400 text-[11px] mt-2">
                Leave blank to generate it from the title.
              </p>
            </div>
          </div>

          {!hasVariants && (
            <div className="sm:w-1/2 sm:pr-3">
              <label className={label} htmlFor="price">
                Price (₹) *
              </label>
              {/* step must stay 1 — a step of 1000 silently fails HTML
                  validation on any price that is not a round thousand. */}
              <input
                id="price"
                name="price"
                type="number"
                min={0}
                step={1}
                defaultValue={product?.price || ""}
                placeholder="8500"
                className={input}
              />
            </div>
          )}

          <div>
            <label className={label} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={product?.description}
              placeholder="What it fits, what it is made of, what we charge to fit it."
              className={input}
            />
          </div>
        </div>
      </section>

      {/* ---------- Options ---------- */}
      <section className={panel}>
        <h2 className="text-white font-bold text-[15px] mb-1">Options</h2>
        <p className="text-gray-400 text-xs mb-6">
          Only if the part is sold more than one way — per car, per size, per
          finish. Each option carries its own price and replaces the single
          price above. Leave this empty for a part sold one way.
        </p>

        {variants.length > 0 && (
          <div className="flex flex-col gap-3 mb-5">
            {variants.map((v, i) => (
              <div key={i} className="flex gap-3">
                <input
                  value={v.name}
                  onChange={(e) => setDraft(i, { name: e.target.value })}
                  placeholder="Swift"
                  aria-label={`Option ${i + 1} name`}
                  className={`${input} flex-1`}
                />
                <input
                  value={v.price}
                  onChange={(e) => setDraft(i, { price: e.target.value })}
                  type="number"
                  min={0}
                  step={1}
                  placeholder="42000"
                  aria-label={`Option ${i + 1} price`}
                  className={`${input} w-32 sm:w-40`}
                />
                <button
                  type="button"
                  onClick={() => setVariants((p) => p.filter((_, n) => n !== i))}
                  className="shrink-0 grid place-items-center w-12 border border-[#23292d] text-gray-400 hover:text-white hover:border-[#E43E3D] hover:bg-[#E43E3D] transition-colors"
                  aria-label={`Remove option ${i + 1}`}
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setVariants((p) => [...p, { name: "", price: "" }])}
          className="inline-flex items-center gap-1.5 border border-dashed border-[#2b3338] hover:border-[#E43E3D] px-5 py-3.5 text-gray-400 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add option
        </button>
      </section>

      {/* ---------- Photos ---------- */}
      <section className={panel}>
        <h2 className="text-white font-bold text-[15px] mb-1">Photos</h2>
        <p className="text-gray-400 text-xs mb-6">
          The first photo is the cover. Use the arrows to reorder.
        </p>

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
            {images.map((m, i) => (
              <div key={m.publicId} className="flex flex-col gap-1.5">
                <div
                  draggable
                  onDragStart={() => (dragIndex.current = i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => drop(i)}
                  className="relative aspect-4/3 overflow-hidden border border-[#23292d] bg-[#0a0f12] md:cursor-move"
                >
                  <Image
                    src={img(m.url, 300)}
                    alt=""
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 45vw, 200px"
                    className="object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute top-1.5 left-1.5 bg-[#E43E3D] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                      Cover
                    </span>
                  )}
                </div>

                {/* Always-visible controls: touch has no hover and no HTML5
                    drag, and these photos get managed from a phone. */}
                <div className="flex items-stretch gap-1.5">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => move(i, i - 1)}
                    className={thumbBtn}
                    aria-label={`Move photo ${i + 1} earlier`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={i === images.length - 1}
                    onClick={() => move(i, i + 1)}
                    className={thumbBtn}
                    aria-label={`Move photo ${i + 1} later`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setImages((p) => p.filter((x) => x.publicId !== m.publicId))
                    }
                    className="grid place-items-center h-9 flex-1 border border-[#23292d] text-gray-400 hover:text-white hover:border-[#E43E3D] hover:bg-[#E43E3D] transition-colors"
                    aria-label={`Remove photo ${i + 1}`}
                  >
                    <Close className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <label className="inline-block cursor-pointer border border-dashed border-[#2b3338] hover:border-[#E43E3D] px-5 py-3.5 text-gray-400 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors">
          <Plus className="w-3.5 h-3.5 inline-block mr-1.5 -mt-px" />
          Add photos
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              // Snapshot now: clearing input.value empties the live FileList.
              setToCrop(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
        </label>

        {toCrop.length > 0 && (
          <PhotoCropper
            files={toCrop}
            onCancel={() => setToCrop([])}
            onDone={(cropped) => {
              setToCrop([]);
              handleImages(cropped);
            }}
          />
        )}

        {busy && (
          <p className="tnum text-gray-400 text-[13px] mt-4">
            {busy} {progress > 0 && `${progress}%`}
          </p>
        )}

        {uploadError && (
          <p
            role="alert"
            className="border-l border-[#E43E3D] bg-[#E43E3D]/10 px-4 py-3 text-[#ff8a89] text-[13px] font-medium mt-4"
          >
            {uploadError}
          </p>
        )}
      </section>

      {/* ---------- Visibility ---------- */}
      <section className={`${panel} flex flex-wrap gap-8`}>
        <label className="inline-flex items-center gap-2.5 py-2 text-gray-300 text-sm cursor-pointer">
          <input
            type="checkbox"
            name="inStock"
            defaultChecked={product?.inStock ?? true}
            className="accent-[#E43E3D] w-5 h-5"
          />
          In stock
        </label>
        <label className="inline-flex items-center gap-2.5 py-2 text-gray-300 text-sm cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product?.featured}
            className="accent-[#E43E3D] w-5 h-5"
          />
          Feature on homepage
        </label>
      </section>

      {state.error && (
        <p
          role="alert"
          className="border-l border-[#E43E3D] bg-[#E43E3D]/10 px-4 py-3 text-[#ff8a89] text-[13px] font-medium"
        >
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-end gap-4 pb-16">
        <Link
          href="/admin/products"
          className="text-gray-400 hover:text-white font-bold text-[11px] uppercase tracking-widest transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending || Boolean(busy)}
          className="bg-[#E43E3D] hover:bg-[#c7322f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-widest py-3.5 px-9 transition-colors"
        >
          {pending ? "Saving…" : product ? "Save Changes" : "Publish Part"}
        </button>
      </div>
    </form>
  );
}
