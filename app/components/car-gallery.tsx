"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { img } from "@/lib/media";
import type { Car } from "@/lib/types";
import { Play } from "./icons";

export default function CarGallery({ car }: { car: Car }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const count = car.images.length;

  // Advances every 5s. `active` is a dependency on purpose: picking a thumbnail
  // restarts the clock instead of jumping again a moment later.
  useEffect(() => {
    if (count < 2 || paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % count), 5000);
    return () => clearTimeout(t);
  }, [active, count, paused]);

  return (
    <div>
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative w-full aspect-4/3 overflow-hidden bg-[#111] shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
      >
        {/*
          Every photo is in the DOM and eagerly fetched, cross-fading on opacity.
          Swapping a single <Image> src meant each slide started downloading the
          moment it was shown — a visible blank box on every advance.
        */}
        {car.images.map((m, i) => (
          <Image
            key={m.publicId}
            src={img(m.url, 1200)}
            alt={i === 0 ? car.title : ""}
            fill
            unoptimized
            {...(i === 0 ? { priority: true } : { loading: "eager" as const })}
            sizes="(max-width: 1024px) 100vw, 62vw"
            className={`object-cover transition-opacity duration-700 ease-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {car.sold && (
          <span className="absolute top-0 left-0 bg-black/85 text-gray-200 font-black text-[11px] uppercase tracking-[0.2em] px-4 py-2.5">
            Sold
          </span>
        )}
      </div>

      {car.images.length > 1 && (
        <div className="flex flex-wrap gap-px bg-[#23292d] mt-px">
          {car.images.map((m, i) => (
            <button
              key={m.publicId}
              onClick={() => setActive(i)}
              aria-label={`Photo ${i + 1} of ${car.images.length}`}
              aria-current={i === active}
              className="relative aspect-4/3 w-[calc(25%-1px)] sm:w-[calc(14.2857%-1px)] overflow-hidden bg-[#111] group"
            >
              <Image
                src={img(m.url, 240)}
                alt=""
                fill
                unoptimized
                sizes="140px"
                className={`object-cover transition-all duration-500 ${
                  i === active
                    ? "grayscale-0"
                    : "grayscale opacity-55 group-hover:opacity-100 group-hover:grayscale-0"
                }`}
              />
              {/* Active marker is a solid bar, not a rounded ring. */}
              <span
                aria-hidden
                className={`absolute inset-x-0 bottom-0 h-[3px] transition-colors duration-300 ${
                  i === active ? "bg-[#E43E3D]" : "bg-transparent"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {car.video && (
        <div className="mt-10">
          <h2 className="text-white font-black uppercase tracking-tighter text-xl mb-4">
            Walkaround
          </h2>

          {/*
            preload="none" is the bandwidth guard: not one byte of video loads
            until this button is pressed, so browsing costs nothing.
          */}
          {playing ? (
            <video
              src={car.video.url}
              poster={car.video.poster}
              controls
              autoPlay
              preload="none"
              playsInline
              className="w-full bg-black shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              className="relative block w-full aspect-video bg-[#111] overflow-hidden group shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
              aria-label={`Play walkaround video of ${car.title}`}
            >
              <Image
                src={car.video.poster}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 62vw"
                className="object-cover grayscale-[0.4] group-hover:grayscale-0 transition-[filter,transform] duration-[900ms] ease-out group-hover:scale-[1.03]"
              />
              <span className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors duration-500" />
              <span className="absolute left-0 bottom-0 flex items-center gap-3 bg-[#E43E3D] text-white px-6 py-4 font-black text-xs uppercase tracking-widest">
                <Play className="w-4 h-4" />
                Play walkaround
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
