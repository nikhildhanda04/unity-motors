"use client";

import { useMemo, useRef, useState } from "react";
import {
  MAX_ZOOM,
  RATIO,
  coverRect,
  pan,
  zoomOf,
  zoomTo,
  type Rect,
} from "@/lib/crop";

/**
 * Pre-upload 4:3 cropper.
 *
 * Every frame on the site renders photos at 4:3 with object-cover, so a
 * portrait phone photo used to get centre-cropped by the browser at display
 * time — roofs and number plates sliced off with no way to correct it. This
 * bakes the crop in before the file leaves the browser, so what the admin
 * frames here is exactly what every page shows.
 */

/** The widest the site ever renders a photo. Cropping larger is wasted bytes. */
const OUT_WIDTH = 1600;

export default function PhotoCropper({
  files,
  onDone,
  onCancel,
}: {
  files: File[];
  onDone: (cropped: File[]) => void;
  onCancel: () => void;
}) {
  const [index, setIndex] = useState(0);
  // Carries its own file so a stale rect can never be applied to the next photo.
  const [shot, setShot] = useState<{
    file: File;
    nat: { w: number; h: number };
    rect: Rect;
  } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const done = useRef<File[]>([]);
  const drag = useRef<{ px: number; py: number; frameW: number } | null>(null);

  const file = files[index];
  const src = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  const ready = shot?.file === file ? shot : null;
  const nat = ready?.nat ?? { w: 0, h: 0 };
  const rect = ready?.rect ?? null;

  function onLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (file) setShot({ file, nat: { w, h }, rect: coverRect(w, h) });
  }

  function setRect(next: Rect) {
    setShot((s) => (s ? { ...s, rect: next } : s));
  }

  function setZoom(zoom: number) {
    if (rect) setRect(zoomTo(rect, nat, zoom));
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      px: e.clientX,
      py: e.clientY,
      frameW: e.currentTarget.getBoundingClientRect().width,
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d || !rect) return;
    // Frame pixels -> source pixels. Dragging the photo right moves the crop left.
    const k = rect.w / d.frameW;
    const dx = -(e.clientX - d.px) * k;
    const dy = -(e.clientY - d.py) * k;
    d.px = e.clientX;
    d.py = e.clientY;
    setRect(pan(rect, nat, dx, dy));
  }

  function next(cropped: File) {
    // Revoked here, never in an effect cleanup: React StrictMode fires cleanups
    // immediately after mount, which killed the URL before <img> could load it.
    URL.revokeObjectURL(src);
    done.current = [...done.current, cropped];
    if (index + 1 < files.length) setIndex(index + 1);
    else onDone(done.current);
  }

  function apply() {
    const el = imgRef.current;
    if (!el || !rect || !file) return;

    const outW = Math.min(OUT_WIDTH, Math.round(rect.w));
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = Math.round(outW / RATIO);
    const ctx = canvas.getContext("2d");
    // Canvas unavailable: ship the original rather than block the upload.
    if (!ctx) return next(file);

    ctx.drawImage(
      el,
      rect.x,
      rect.y,
      rect.w,
      rect.h,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    canvas.toBlob(
      (blob) =>
        next(
          blob
            ? new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", {
                type: "image/jpeg",
                lastModified: file.lastModified,
              })
            : file,
        ),
      "image/jpeg",
      0.9,
    );
  }

  if (!file) return null;

  const zoom = rect ? zoomOf(rect, nat) : 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 grid place-items-center p-4 overflow-auto">
      <div className="w-full max-w-2xl bg-[#0e1316] border border-[#1b2126] p-5 sm:p-7">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="text-white font-bold text-[15px]">
            Position the photo
          </h2>
          <span className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.18em]">
            {index + 1} / {files.length}
          </span>
        </div>
        <p className="text-gray-400 text-xs mb-5">
          Drag to move, slide to zoom. This 4:3 frame is exactly what the site
          shows.
        </p>

        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
          className="relative w-full aspect-4/3 overflow-hidden bg-[#0a0f12] border border-[#23292d] cursor-move touch-none select-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={src}
            alt=""
            draggable={false}
            onLoad={onLoad}
            onError={() => file && next(file)}
            className="absolute max-w-none origin-top-left"
            style={
              rect
                ? {
                    width: `${(nat.w / rect.w) * 100}%`,
                    height: `${(nat.h / rect.h) * 100}%`,
                    left: `${-(rect.x / rect.w) * 100}%`,
                    top: `${-(rect.y / rect.h) * 100}%`,
                  }
                : { opacity: 0 }
            }
          />
          {/* Thirds guide — the only thing that makes "centred" judgeable. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className="border border-white/10" />
            ))}
          </div>
        </div>

        <label className="flex items-center gap-4 mt-5">
          <span className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.18em]">
            Zoom
          </span>
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-[#E43E3D]"
          />
        </label>

        <div className="flex items-center justify-end gap-4 mt-7">
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-white font-bold text-[11px] uppercase tracking-widest transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={apply}
            disabled={!rect}
            className="bg-[#E43E3D] hover:bg-[#c7322f] disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest py-3 px-7 transition-colors"
          >
            {index + 1 < files.length ? "Use & next" : "Use photo"}
          </button>
        </div>
      </div>
    </div>
  );
}
