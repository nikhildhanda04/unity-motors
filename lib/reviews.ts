/**
 * Customer reviews, read straight out of the Google Sheet behind the review
 * form. No API key and no OAuth: the sheet is published to the web as CSV
 * (File > Share > Publish to web), which is a plain public URL we can fetch.
 *
 * Setup lives in docs/reviews-setup.md.
 */

export type Review = {
  name: string;
  subject: string;
  rating: number;
  body: string;
  date: string;
};

/**
 * Minimal RFC-4180 reader. Sheets quotes any field holding a comma or a
 * newline, and a review without a comma in it is rare, so split(",") is not
 * an option.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c !== '"') field += c;
      else if (text[i + 1] === '"') {
        field += '"'; // "" is an escaped quote
        i++;
      } else quoted = false;
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") {
      field += c;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/**
 * Columns are found by a keyword in the header rather than by position, so the
 * owner can reword a form question or add one without breaking the site.
 */
const find = (headers: string[], keyword: string) =>
  headers.findIndex((h) => h.toLowerCase().includes(keyword));

const YES = /^(yes|y|true|1|approved|✓|✔)$/i;

export function parseReviews(csv: string): Review[] {
  const [headers, ...rows] = parseCsv(csv);
  if (!headers) return [];

  const col = {
    date: find(headers, "timestamp"),
    name: find(headers, "name"),
    subject: find(headers, "car or service"),
    rating: find(headers, "rating"),
    body: find(headers, "review"),
    approved: find(headers, "approved"),
  };

  // A public form on a public website: anything can be submitted, so nothing
  // is published until the owner types "yes" in the Approved column. If that
  // column is missing, nothing publishes — the safe direction to fail in.
  if (col.approved === -1) return [];

  const at = (r: string[], i: number) => (i === -1 ? "" : (r[i] ?? "").trim());

  return rows
    .filter((r) => YES.test(at(r, col.approved)))
    .map((r) => ({
      name: at(r, col.name) || "Customer",
      subject: at(r, col.subject),
      // Ratings arrive as "5" or as "5 - Excellent" depending on the question type.
      rating: Math.min(5, Math.max(0, parseInt(at(r, col.rating), 10) || 0)),
      body: at(r, col.body),
      date: at(r, col.date),
    }))
    .filter((v) => v.body !== "")
    .reverse(); // newest first — Forms appends to the bottom of the sheet
}

/** Empty when the sheet is not configured, unreachable, or has nothing approved. */
export async function getReviews(): Promise<Review[]> {
  const url = process.env.REVIEWS_CSV_URL;
  if (!url) return [];

  // Same 5-minute window as the car list: fresh enough for a review desk,
  // cheap enough that every page render is not an outbound fetch.
  const res = await fetch(url, { next: { revalidate: 300 } }).catch(() => null);
  if (!res?.ok) return [];

  return parseReviews(await res.text());
}
