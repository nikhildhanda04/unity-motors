"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useSyncExternalStore } from "react";
import {
  MAX_QTY,
  addLine,
  cartCount,
  cartTotal,
  lineKey,
  loadCart,
  removeLine,
  setQty,
  type CartLine,
} from "@/lib/cart";
import { cartEnquiryLink } from "@/lib/whatsapp";
import { img } from "@/lib/media";
import { formatPrice } from "@/lib/types";
import { Cart as CartIcon, Close, Minus, Plus, WhatsApp } from "./icons";

const KEY = "um-cart";

/**
 * The cart is an external store (localStorage), shared by a floating button, a
 * drawer and every product page — so it is read with useSyncExternalStore
 * rather than mirrored into component state. No provider to forget to mount,
 * and no effect syncing one source of truth into another.
 */
let lines: CartLine[] = [];
let drawerOpen = false;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => void listeners.delete(l);
};

function commit(next: CartLine[]) {
  lines = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private mode or a full quota. The cart still works for this visit, which
    // is all it has to do — the order leaves over WhatsApp, not from storage.
  }
  emit();
}

/**
 * Reads storage once the client is running. Starts empty so the server HTML
 * and the first client render agree; the stored cart arrives on the next tick.
 */
function hydrate() {
  const stored = loadCart(localStorage.getItem(KEY));
  if (stored.length === 0 && lines.length === 0) return;
  lines = stored;
  emit();
}

const EMPTY: CartLine[] = [];

export function useCart() {
  const current = useSyncExternalStore(
    subscribe,
    () => lines,
    () => EMPTY,
  );
  const open = useSyncExternalStore(
    subscribe,
    () => drawerOpen,
    () => false,
  );

  useEffect(hydrate, []);

  return {
    lines: current,
    add: (line: CartLine) => commit(addLine(lines, line)),
    setLineQty: (key: string, qty: number) => commit(setQty(lines, key, qty)),
    remove: (key: string) => commit(removeLine(lines, key)),
    total: cartTotal(current),
    count: cartCount(current),
    open,
    setOpen: (v: boolean) => {
      drawerOpen = v;
      emit();
    },
  };
}

/**
 * Floating, and only once something is in it. This is a detailing site with a
 * parts counter attached, not a shop — a permanent empty cart on the hero
 * would misdescribe the business.
 */
function CartButton() {
  const { count, setOpen, open } = useCart();
  if (count === 0 || open) return null;

  return (
    <button
      onClick={() => setOpen(true)}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-[#E43E3D] text-white pl-5 pr-6 py-4 font-black text-xs uppercase tracking-widest shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:bg-[#c73332] transition-colors"
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
    >
      <CartIcon className="w-5 h-5" />
      Cart
      <span className="tnum bg-black/30 px-2 py-0.5">{count}</span>
    </button>
  );
}

function QtyStepper({ line }: { line: CartLine }) {
  const { setLineQty } = useCart();
  const key = lineKey(line);
  const btn =
    "w-8 h-8 grid place-items-center border border-[#23292d] text-gray-400 hover:text-white hover:border-[#E43E3D] transition-colors disabled:opacity-30 disabled:hover:border-[#23292d] disabled:hover:text-gray-400";

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => setLineQty(key, line.qty - 1)} className={btn} aria-label="Reduce quantity">
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="tnum w-7 text-center text-white font-bold text-sm">{line.qty}</span>
      <button
        onClick={() => setLineQty(key, line.qty + 1)}
        disabled={line.qty >= MAX_QTY}
        className={btn}
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/**
 * Every field rendered here comes off the line itself, never off a fresh
 * product lookup — a line whose product has since been deleted still shows
 * what the customer chose instead of vanishing or throwing.
 */
function Line({ line }: { line: CartLine }) {
  const { remove, setOpen } = useCart();

  return (
    <li className="flex gap-4 py-5 border-b border-[#1b2126]">
      <div className="relative w-20 h-20 shrink-0 bg-[#0e1316] overflow-hidden">
        {line.image && (
          <Image src={img(line.image, 200)} alt="" fill className="object-cover" sizes="80px" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Link
          href={`/store/${line.slug}`}
          onClick={() => setOpen(false)}
          className="block text-white font-black uppercase tracking-tight text-sm leading-tight hover:text-[#E43E3D] transition-colors"
        >
          {line.title}
        </Link>
        {line.variant && (
          <span className="block text-gray-500 text-[12px] font-medium mt-1">{line.variant}</span>
        )}
        <div className="flex items-center justify-between gap-3 mt-3">
          <QtyStepper line={line} />
          <span className="tnum text-white font-bold text-sm">
            ₹{formatPrice(line.price * line.qty)}
          </span>
        </div>
      </div>

      <button
        onClick={() => remove(lineKey(line))}
        className="text-gray-600 hover:text-[#E43E3D] transition-colors self-start"
        aria-label={`Remove ${line.title}`}
      >
        <Close className="w-4 h-4" />
      </button>
    </li>
  );
}

function CartDrawer() {
  const { lines, total, open, setOpen } = useCart();

  // Escape closes, and the page behind must not scroll under the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/70 z-50"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.45 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-[#0a0f12] border-l border-[#23292d] flex flex-col font-sans"
            aria-label="Cart"
          >
            <header className="flex items-center justify-between px-6 py-6 border-b-2 border-[#E43E3D]">
              <h2 className="text-white font-black uppercase tracking-tight text-lg">
                Your Cart
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <Close className="w-5 h-5" />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex-1 grid place-items-center px-6 text-center">
                <div>
                  <p className="text-gray-400 font-medium text-[15px]">Nothing in the cart yet.</p>
                  <Link
                    href="/store"
                    onClick={() => setOpen(false)}
                    className="inline-block mt-4 text-white hover:text-[#E43E3D] font-black text-xs uppercase tracking-widest transition-colors"
                  >
                    Browse the store
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="flex-1 overflow-y-auto px-6">
                {lines.map((l) => (
                  <Line key={lineKey(l)} line={l} />
                ))}
              </ul>
            )}

            {lines.length > 0 && (
              <footer className="px-6 py-6 border-t border-[#23292d] space-y-5">
                <div className="flex items-end justify-between">
                  <span className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.18em]">
                    Total
                  </span>
                  <span className="tnum text-white font-black text-2xl tracking-tight">
                    ₹{formatPrice(total)}
                  </span>
                </div>

                {/* Not cleared on tap: WhatsApp opens with the message typed,
                    and the customer still has to press send. Emptying the cart
                    here would lose the order if they came back to check. */}
                <a
                  href={cartEnquiryLink(lines)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-[#E43E3D] hover:bg-[#c73332] text-white font-black text-sm uppercase tracking-widest py-4 transition-colors"
                >
                  <WhatsApp className="w-5 h-5" />
                  Order on WhatsApp
                </a>

                <p className="text-gray-500 text-[12px] font-medium leading-relaxed">
                  Opens WhatsApp with your list typed out. We confirm stock and
                  the final price in the chat.
                </p>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/** Button plus drawer, mounted once in the root layout. */
export function CartDock() {
  return (
    <>
      <CartButton />
      <CartDrawer />
    </>
  );
}
