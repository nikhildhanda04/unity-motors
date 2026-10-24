import { getReviews } from "@/lib/reviews";

const FORM_URL = process.env.NEXT_PUBLIC_REVIEW_FORM_URL;

/** Five slots, filled to the rating. Text, so it needs no icon font or SVG. */
function Stars({ n }: { n: number }) {
  return (
    <span className="text-[#E43E3D] tracking-[0.2em] text-sm" aria-label={`${n} out of 5`}>
      {"★".repeat(n)}
      <span className="text-[#23292d]">{"★".repeat(5 - n)}</span>
    </span>
  );
}

/**
 * Real reviews only. Renders nothing until someone has actually left one and
 * the owner has approved it — an empty praise section is worse than none.
 */
export default async function ReviewsSection() {
  const reviews = await getReviews();
  if (reviews.length === 0) return null;

  const show = reviews.slice(0, 6);

  return (
    <section
      id="reviews"
      className="w-full bg-[#0a0f12] py-24 sm:py-32 font-sans border-t border-gray-900"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 pb-10">
          <h2 className="text-[clamp(2.75rem,9vw,5.5rem)] font-black text-white uppercase tracking-[-0.045em] leading-[0.8]">
            What They Say
          </h2>
          <p className="tnum text-gray-400 text-[13px] font-medium pb-2 md:text-right">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            <span className="block text-[#E43E3D] font-bold uppercase tracking-[0.18em] text-[11px] mt-1.5">
              Left by customers themselves
            </span>
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#23292d] border-t-2 border-[#E43E3D] border-b border-[#23292d]">
          {show.map((r, i) => (
            <figure key={i} className="bg-[#0a0f12] p-7 flex flex-col gap-4">
              <Stars n={r.rating} />
              <blockquote className="text-gray-300 font-medium leading-[1.75] text-[15px] whitespace-pre-line flex-1">
                {r.body}
              </blockquote>
              <figcaption className="pt-1">
                <span className="block text-white font-black uppercase tracking-tight text-sm">
                  {r.name}
                </span>
                {r.subject && (
                  <span className="block text-gray-500 text-[12px] font-medium mt-0.5">
                    {r.subject}
                  </span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>

        {FORM_URL && (
          <div className="border-t border-[#23292d] pt-8">
            <a
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 text-white hover:text-[#E43E3D] font-black text-sm uppercase tracking-widest transition-colors"
            >
              Leave your review
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
