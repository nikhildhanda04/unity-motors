"use client";

import Image from "next/image";
import { useState } from "react";
import { img } from "@/lib/media";
import type { Media } from "@/lib/types";

/**
 * Main shot plus a thumbnail strip. Deliberately not CarGallery: that one
 * takes a whole Car and handles video, and parts have neither.
 */
export default function ProductGallery({
  images,
  title,
}: {
  images: Media[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-[4/3] bg-[#0e1316] overflow-hidden">
        {main && (
          <Image
            src={img(main.url, 1200)}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
            className="object-cover"
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {images.map((m, i) => (
            <button
              key={m.publicId}
              onClick={() => setActive(i)}
              aria-label={`Photo ${i + 1} of ${images.length}`}
              className={`relative w-20 h-20 shrink-0 overflow-hidden border transition-colors ${
                i === active ? "border-[#E43E3D]" : "border-[#1b2126] hover:border-[#23292d]"
              }`}
            >
              <Image src={img(m.url, 200)} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
