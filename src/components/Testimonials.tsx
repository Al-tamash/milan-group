import { ArrowUpRight, Star } from "lucide-react";
import { site } from "@/lib/data";
import reviews from "@/data/reviews.json";

// D23: these must be real Google reviews before launch. Entries flagged `sample` are layout placeholders; while
// any remain, one note under the rating says so. Fill in `name` with the Google reviewer's name to show it.
function Stars({ value, className = "h-4 w-4" }: { value: number; className?: string }) {
  return (
    <span className="flex text-gold" aria-label={`${value} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={className} fill={i < Math.round(value) ? "currentColor" : "none"} strokeWidth={1.5} />
      ))}
    </span>
  );
}

export function Testimonials() {
  const hasSamples = reviews.some((r) => r.sample);

  return (
    <section aria-labelledby="reviews" className="bg-forest py-16 text-ivory sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="reviews" className="font-display text-4xl sm:text-5xl">What people say after the function</h2>
          <div className="mt-8 flex items-end gap-4">
            <span className="font-display text-7xl leading-none text-gold">{site.rating.value}</span>
            <div className="pb-1.5">
              <Stars value={site.rating.value} />
              <p className="mt-1.5 text-sm text-ivory/75">{site.rating.count} reviews on Google</p>
            </div>
          </div>
          <a
            href={site.mapUrl}
            target="_blank"
            rel="noopener"
            className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-gold underline-offset-4 hover:text-ivory hover:underline"
          >
            Read all reviews on Google <ArrowUpRight className="h-4 w-4" />
          </a>
          {hasSamples && (
            <p className="mt-6 max-w-xs rounded-lg border border-dashed border-gold/40 px-3 py-2 text-xs leading-relaxed text-ivory/70">
              Preview: the reviews here are samples for layout. They will be replaced with real Google reviews before
              the site goes live.
            </p>
          )}
        </div>

        <ul className="review-rail -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 md:mx-0 md:block md:columns-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
          {reviews.map((r) => (
            <li
              key={r.text}
              className="flex w-[82%] shrink-0 snap-start flex-col rounded-xl border border-ivory/12 bg-ivory/[0.04] p-6 sm:w-[60%] md:mb-5 md:w-auto md:break-inside-avoid"
            >
              <figure className="flex h-full flex-col">
                <Stars value={r.rating} className="h-3.5 w-3.5" />
                <blockquote className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ivory/90">
                  <p>&ldquo;{r.text}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-ivory/10 pt-4 text-sm">
                  {r.name && (
                    <span
                      aria-hidden
                      className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/50 text-lg text-gold"
                    >
                      {r.name.charAt(0)}
                    </span>
                  )}
                  <span>
                    <span className="block font-semibold text-ivory/90">{r.name || r.occasion}</span>
                    <span className="block text-ivory/60">{r.name ? `${r.occasion} · ${r.area}` : r.area}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
