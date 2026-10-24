"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { saveCar, type SaveState } from "../../actions";
import { uploadToCloudinary } from "@/lib/upload";
import PhotoCropper from "./photo-cropper";
import { img, videoPoster } from "@/lib/media";
import { ArrowLeft, ArrowRight, Close, Plus } from "../../../components/icons";
import {
  FUEL_TYPES,
  OWNERSHIPS,
  REGISTRATION_STATES,
  TRANSMISSIONS,
  type Car,
  type Media,
} from "@/lib/types";

const input =
  "w-full bg-[#0a0f12] border border-[#23292d] px-4 py-3.5 text-[15px] text-white placeholder:text-gray-400 focus:border-[#E43E3D] transition-[border-color] duration-200";
const label =
  "text-gray-400 text-[11px] font-bold uppercase tracking-[0.18em] mb-2.5 block";
const panel = "bg-[#0e1316] border border-[#1b2126] p-6 sm:p-8";
const heading = "text-white font-bold text-[15px] mb-6";

export default function CarForm({ car }: { car: Car | null }) {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(
    saveCar,
    {},
  );

  const [images, setImages] = useState<Media[]>(car?.images ?? []);
  const [video, setVideo] = useState<Car["video"]>(car?.video ?? null);
  const [onRequest, setOnRequest] = useState(car?.priceOnRequest ?? false);
  const [busy, setBusy] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const dragIndex = useRef<number | null>(null);
  // Picked files waiting to be framed. Nothing uploads until the cropper is done.
  const [toCrop, setToCrop] = useState<File[]>([]);

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

  async function handleVideo(file: File | null) {
    if (!file) return;
    setUploadError(null);
    setBusy("Uploading video…");
    setProgress(0);
    try {
      const media = await uploadToCloudinary(file, "video", setProgress);
      setVideo({ ...media, poster: videoPoster(media.url) });
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

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <input type="hidden" name="id" value={car?.id ?? "new"} />
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="video" value={JSON.stringify(video)} />

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
              defaultValue={car?.title}
              placeholder="2019 BMW M4 Competition"
              className={input}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={label} htmlFor="price">
                Price (₹)
              </label>
              {/* step must stay 1: step={1000} made any price that was not a round
                  thousand fail HTML validation, so "Publish" silently did nothing. */}
              <input
                id="price"
                name="price"
                type="number"
                min={0}
                step={1}
                disabled={onRequest}
                defaultValue={car?.price || ""}
                placeholder="5450000"
                className={`${input} disabled:opacity-40`}
              />
            </div>

            <div>
              <label className={label} htmlFor="slug">
                URL slug
              </label>
              <input
                id="slug"
                name="slug"
                defaultValue={car?.slug}
                placeholder="auto-generated from title"
                className={input}
              />
              <p className="text-gray-400 text-[11px] mt-2">
                Leave blank to generate it from the title.
              </p>
            </div>
          </div>

          {/*
            Both price terms share a full-width row. They used to be stacked
            inside the half-width price column, where the two inline-flex
            labels butted against each other with no gap at all.
          */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-1">
            <label className="inline-flex items-center gap-3 py-2 text-gray-300 text-[13px] cursor-pointer">
              <input
                type="checkbox"
                name="priceOnRequest"
                defaultChecked={car?.priceOnRequest}
                onChange={(e) => setOnRequest(e.target.checked)}
                className="accent-[#E43E3D] w-[18px] h-[18px]"
              />
              Price on request
            </label>
            {/*
              Ticked by default on a NEW car (`car` is null), because the
              workshop arranges finance on everything unless told otherwise.
              An existing car keeps whatever was saved.
            */}
            <label className="inline-flex items-center gap-3 py-2 text-gray-300 text-[13px] cursor-pointer">
              <input
                type="checkbox"
                name="loanAvailable"
                defaultChecked={car ? car.loanAvailable : true}
                className="accent-[#E43E3D] w-[18px] h-[18px]"
              />
              Loan facility available
            </label>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className={label} htmlFor="year">
                Year
              </label>
              <input
                id="year"
                name="year"
                type="number"
                min={1900}
                max={2100}
                defaultValue={car?.year || ""}
                placeholder="2019"
                className={input}
              />
            </div>
            <div>
              <label className={label} htmlFor="kmDriven">
                KM driven
              </label>
              <input
                id="kmDriven"
                name="kmDriven"
                type="number"
                min={0}
                defaultValue={car?.kmDriven || ""}
                placeholder="42000"
                className={input}
              />
            </div>
            <div>
              <label className={label} htmlFor="fuelType">
                Fuel
              </label>
              <select
                id="fuelType"
                name="fuelType"
                defaultValue={car?.fuelType ?? ""}
                className={input}
              >
                <option value="">—</option>
                {FUEL_TYPES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="transmission">
                Transmission
              </label>
              <select
                id="transmission"
                name="transmission"
                defaultValue={car?.transmission ?? ""}
                className={input}
              >
                <option value="">—</option>
                {TRANSMISSIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="ownership">
                Ownership
              </label>
              <select
                id="ownership"
                name="ownership"
                defaultValue={car?.ownership ?? ""}
                className={input}
              >
                <option value="">—</option>
                {OWNERSHIPS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="stateRegistered">
                Registered in
              </label>
              <select
                id="stateRegistered"
                name="stateRegistered"
                defaultValue={car?.stateRegistered ?? ""}
                className={input}
              >
                <option value="">—</option>
                {REGISTRATION_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={label} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={car?.description}
              placeholder="Condition, service history, modifications, anything a buyer should know."
              className={input}
            />
          </div>

          <div>
            <label className={label} htmlFor="features">
              Features — one per line
            </label>
            <textarea
              id="features"
              name="features"
              rows={6}
              defaultValue={car?.features.join("\n")}
              placeholder={"Sunroof\n360° Camera\nVentilated Seats\nAdaptive Cruise"}
              className={input}
            />
          </div>
        </div>
      </section>

      {/* ---------- Media ---------- */}
      <section className={panel}>
        <h2 className={heading.replace("mb-5", "mb-1")}>Photos</h2>
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

                {/*
                  Touch has no hover and no HTML5 drag, so a hover-reveal delete
                  and a draggable thumbnail are both unreachable on a phone —
                  which is where these photos are actually managed. These
                  controls are always visible and are the only reorder path on
                  mobile; dragging still works on a desktop pointer.
                */}
                <div className="flex items-stretch gap-1.5">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => move(i, i - 1)}
                    className="grid place-items-center h-9 flex-1 border border-[#23292d] text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-[#23292d] transition-colors"
                    aria-label={`Move photo ${i + 1} earlier`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={i === images.length - 1}
                    onClick={() => move(i, i + 1)}
                    className="grid place-items-center h-9 flex-1 border border-[#23292d] text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-[#23292d] transition-colors"
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

        <h2 className="text-white font-bold text-[15px] mt-10 mb-1">Video</h2>
        <p className="text-gray-400 text-xs mb-6">
          Optional. Keep it short — 30–60s compressed. It only loads when a
          visitor presses play.
        </p>

        {video ? (
          <div className="flex items-center gap-4">
            <video
              src={video.url}
              poster={video.poster}
              controls
              preload="none"
              className="w-56 border border-[#23292d]"
            />
            <button
              type="button"
              onClick={() => setVideo(null)}
              className="text-[#E43E3D] text-[11px] font-bold uppercase tracking-widest hover:underline"
            >
              Remove video
            </button>
          </div>
        ) : (
          <label className="inline-block cursor-pointer border border-dashed border-[#2b3338] hover:border-[#E43E3D] px-5 py-3.5 text-gray-400 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors">
            <Plus className="w-3.5 h-3.5 inline-block mr-1.5 -mt-px" />
            Add video
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={(e) => {
                handleVideo(e.target.files?.[0] ?? null);
                e.target.value = "";
              }}
            />
          </label>
        )}

        {busy && (
          <div className="mt-5">
            <p className="text-gray-300 text-xs mb-2">
              {busy} {progress > 0 && `${progress}%`}
            </p>
            <div className="h-1.5 bg-[#1b2126] overflow-hidden">
              <div
                className="h-full bg-[#E43E3D] transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {uploadError && (
          <p role="alert" className="border-l border-[#E43E3D] bg-[#E43E3D]/10 px-4 py-3 text-[#ff8a89] text-[13px] font-medium mt-4">
            {uploadError}
          </p>
        )}
      </section>

      {/* ---------- Visibility ---------- */}
      <section className={`${panel} flex flex-wrap gap-8`}>
        <label className="inline-flex items-center gap-2.5 py-2 text-gray-300 text-sm cursor-pointer">
          <input
            type="checkbox"
            name="sold"
            defaultChecked={car?.sold}
            className="accent-[#E43E3D] w-5 h-5"
          />
          Sold
        </label>
        <label className="inline-flex items-center gap-2.5 py-2 text-gray-300 text-sm cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={car?.featured}
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
          href="/admin"
          className="text-gray-400 hover:text-white font-bold text-[11px] uppercase tracking-widest transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending || Boolean(busy)}
          className="bg-[#E43E3D] hover:bg-[#c7322f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-widest py-3.5 px-9 transition-colors"
        >
          {pending ? "Saving…" : car ? "Save Changes" : "Publish Car"}
        </button>
      </div>
    </form>
  );
}
