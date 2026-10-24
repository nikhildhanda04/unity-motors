/**
 * Cart arithmetic. Pure functions, no React and no localStorage, so the rules
 * can be tested in node — the same split lib/crop.ts uses.
 *
 * A line carries its own title and price rather than a product id to look up:
 * the drawer then renders with no database read, and a line whose product was
 * deleted still shows what the customer put in it.
 *
 * ponytail: prices are copied at add-time, so an admin edit mid-session leaves
 * a stale number in the cart. The message is an enquiry and the owner confirms
 * the price in chat. Re-read prices on drawer open if that stops being true.
 */

export type CartLine = {
  slug: string;
  title: string;
  variant: string | null;
  price: number;
  qty: number;
  /** Copied in with the rest of the line, so the drawer needs no product read. */
  image: string | null;
};

/** One typo should not generate a four-thousand-unit order. */
export const MAX_QTY = 99;

/** Lines are identified by what was bought, not by product alone. */
export const lineKey = (l: Pick<CartLine, "slug" | "variant">) =>
  `${l.slug}::${l.variant ?? ""}`;

const clamp = (n: number) => Math.min(MAX_QTY, Math.max(0, Math.floor(n) || 0));

export function addLine(lines: CartLine[], line: CartLine): CartLine[] {
  const key = lineKey(line);
  const existing = lines.find((l) => lineKey(l) === key);
  if (!existing) return [...lines, { ...line, qty: clamp(line.qty) || 1 }];
  return lines.map((l) =>
    lineKey(l) === key ? { ...l, qty: clamp(l.qty + line.qty) } : l,
  );
}

/** Setting a quantity to zero or below removes the line: a qty-0 row in the
 *  WhatsApp message reads as a mistake, and leaving it is one. */
export function setQty(lines: CartLine[], key: string, qty: number): CartLine[] {
  const next = clamp(qty);
  if (next === 0) return removeLine(lines, key);
  return lines.map((l) => (lineKey(l) === key ? { ...l, qty: next } : l));
}

export const removeLine = (lines: CartLine[], key: string) =>
  lines.filter((l) => lineKey(l) !== key);

export const cartTotal = (lines: CartLine[]) =>
  lines.reduce((sum, l) => sum + l.price * l.qty, 0);

export const cartCount = (lines: CartLine[]) =>
  lines.reduce((n, l) => n + l.qty, 0);

const isLine = (v: unknown): v is CartLine => {
  const l = v as CartLine;
  return (
    !!l &&
    typeof l.slug === "string" &&
    typeof l.title === "string" &&
    typeof l.price === "number" &&
    typeof l.qty === "number" &&
    (l.variant === null || typeof l.variant === "string") &&
    (l.image === null || typeof l.image === "string")
  );
};

/**
 * Reads whatever is in storage. Anything unreadable — malformed JSON, an older
 * shape, a half-written value — resets to an empty cart. Throwing here would
 * happen during hydration and take the whole page down with it.
 */
export function loadCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isLine)) return [];
    return parsed.map((l) => ({ ...l, qty: clamp(l.qty) })).filter((l) => l.qty > 0);
  } catch {
    return [];
  }
}
