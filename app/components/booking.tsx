"use client";

import Image from "next/image";
import { useState, type SyntheticEvent } from "react";
import {
  appointmentLink,
  enquiryNumber,
  enquiryNumberDisplay,
} from "@/lib/whatsapp";
import { Phone, WhatsApp } from "./icons";

/**
 * The booking form, in the register language: square corners, hairline borders,
 * ink fields on a panel-black ground. The incumbent version was a white
 * pill-shaped card — a second visual world sitting on top of this one.
 *
 * It also used to discard every submission (`preventDefault` with no handler
 * and no name attributes). It now routes down the same click-to-chat path as a
 * car enquiry, so a lead reaches the number the workshop already watches
 * without a form backend, an inbox, or anything to keep running.
 */

const field =
  "w-full bg-ink border border-hairline px-4 py-3 text-[15px] text-white " +
  "placeholder:text-gray-400 focus:border-signal transition-[border-color] duration-200";
const label =
  "block text-gray-400 text-[11px] font-bold uppercase tracking-[0.18em] mb-2";

/**
 * Required marker. Only name and phone are required — they are the whole point
 * of the form: enough to call someone back. The label's 0.18em tracking adds a
 * gap after the last letter, so the asterisk is pulled back onto the word.
 * aria-hidden because the input's own `required` is what assistive tech reads.
 */
const Req = () => (
  <span className="text-signal -ml-[0.18em]" aria-hidden>
    *
  </span>
);

export const BookingSection = () => {
  // Holds the composed wa.me link after a submit, so a blocked popup still
  // leaves the customer a way through instead of a dead button.
  const [sent, setSent] = useState<string | null>(null);

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const link = appointmentLink({
      name: String(d.get("name") ?? ""),
      phone: String(d.get("phone") ?? ""),
      email: String(d.get("email") ?? ""),
      vehicle: String(d.get("vehicle") ?? ""),
      notes: String(d.get("notes") ?? ""),
    });
    setSent(link);
    // Synchronous inside the submit gesture, or Safari blocks it.
    window.open(link, "_blank", "noopener,noreferrer");
  }

  return (
    <section
      id="booking"
      className="relative w-full flex items-center justify-center bg-ink overflow-hidden font-sans py-20 sm:py-28"
    >
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/1.JPG"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-60 grayscale-[0.3]"
        />
        {/* Keeps the left column legible without washing the photo to grey. */}
        <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/88 to-ink/45" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[1fr_minmax(0,32rem)] gap-12 lg:gap-16 items-center">
        <div>
          <h2 className="text-[clamp(2.4rem,7.5vw,5rem)] font-black uppercase text-white tracking-[-0.045em] leading-[0.85] text-balance">
            Let&apos;s book an appointment
          </h2>
          <p className="mt-6 text-gray-300 text-[15px] font-medium leading-[1.75] max-w-[46ch]">
            Tell us what the car needs and when suits you. We&apos;ll confirm the
            slot on WhatsApp — usually the same day.
          </p>

          {/* The out for people who will never fill in a form. */}
          {enquiryNumber() && (
            <a
              href={`tel:+${enquiryNumber()}`}
              className="mt-8 inline-flex items-center gap-2.5 text-white hover:text-signal text-[11px] font-bold uppercase tracking-[0.18em] transition-[color] duration-200"
            >
              <Phone className="w-4 h-4" />
              Or call {enquiryNumberDisplay()}
            </a>
          )}
        </div>

        <div className="bg-panel p-6 sm:p-9 shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={label} htmlFor="bk-name">
                  Full name<Req />
                </label>
                <input
                  id="bk-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Jay Sharma"
                  className={field}
                />
              </div>
              <div>
                <label className={label} htmlFor="bk-phone">
                  Phone number<Req />
                </label>
                <input
                  id="bk-phone"
                  name="phone"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  className={field}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={label} htmlFor="bk-vehicle">
                  Vehicle
                </label>
                <input
                  id="bk-vehicle"
                  name="vehicle"
                  type="text"
                  placeholder="Honda City"
                  className={field}
                />
              </div>
              <div>
                <label className={label} htmlFor="bk-email">
                  Email
                </label>
                <input
                  id="bk-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="jay@email.com"
                  className={field}
                />
              </div>
            </div>

            <div>
              <label className={label} htmlFor="bk-notes">
                What does it need?
              </label>
              <textarea
                id="bk-notes"
                name="notes"
                rows={4}
                placeholder="Full detail, ceramic coating, interior shampoo…"
                className={`${field} resize-y min-h-28`}
              />
            </div>

            <button
              type="submit"
              className="mt-1 inline-flex items-center justify-center gap-3 w-full sm:w-auto sm:self-start bg-signal hover:bg-[#c7322f] text-white font-black text-xs uppercase tracking-widest py-4 px-8 transition-[background-color] duration-200"
            >
              <WhatsApp className="w-5 h-5" />
              Request Appointment
            </button>

            <p className="text-gray-400 text-[11px] leading-relaxed">
              {sent ? (
                <>
                  WhatsApp didn&apos;t open?{" "}
                  <a
                    href={sent}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-signal font-bold underline"
                  >
                    Open it manually
                  </a>
                  .
                </>
              ) : (
                "Opens WhatsApp with your details filled in. You send the message."
              )}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
