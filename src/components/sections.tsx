import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { site, type Faq } from "@/lib/data";
import { WhatsAppButton } from "./ContactButtons";

const STEPS = [
  { when: "Any time", title: "Planning", text: "Send your date, venue and guest count on WhatsApp. We suggest what you need." },
  { when: "Before guests arrive", title: "Set-up", text: "Our team brings everything and sets it up before your guests arrive." },
  { when: "On the day", title: "Execution", text: "Our boys stay at the venue till the function ends, in case anything is needed." },
  { when: "Day or night", title: "Support", text: "Call any time, day or night. We clear everything up after." },
];

// The four words come from Milan Group's own catalog cover. Real set-up photo on one side, the steps as a
// numbered rail on the other. The 8:5 frame crops the catalog title off the top of the photo; the gold line
// fills in as you scroll where the browser supports it. Service pages pass photo={false}: they already show their
// own photos, so the heading sits beside the steps instead.
export function HowItWorks({ cta = false, photo = true }: { cta?: boolean; photo?: boolean }) {
  const intro = (
    <>
      <h2 id="how-it-works" className="font-display text-4xl text-emerald sm:text-5xl">How booking works</h2>
      <p className="mt-3 max-w-md text-muted">One WhatsApp message to start. We handle the rest, from the first chair to the last.</p>
    </>
  );

  return (
    <section aria-labelledby="how-it-works" className="bg-white/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        {photo && intro}

        <div className={`grid gap-10 lg:gap-16 ${photo ? "mt-10 items-center lg:grid-cols-[1.2fr_1fr]" : "items-start lg:grid-cols-[1fr_1.2fr]"}`}>
          {!photo && <div>{intro}</div>}
          {photo && (
            <figure className="relative aspect-[8/5] overflow-hidden rounded-xl">
              <Image
                src="/images/products/german-aluminium-pagoda.webp"
                alt="German aluminium pagoda set up on site"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-bottom"
              />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-forest/85 px-3 py-1.5 text-xs text-ivory backdrop-blur-sm">
                German aluminium pagoda, set up on site
              </figcaption>
            </figure>
          )}

          <div>
            <ol className="steps relative">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative grid grid-cols-[2.75rem_1fr] gap-x-5 pb-7 last:pb-0">
                  <span className="font-display relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gold bg-ivory text-xl text-emerald">
                    {i + 1}
                  </span>
                  <div className="pt-2">
                    <h3 className="flex flex-wrap items-baseline gap-x-2.5 text-lg font-semibold text-ink">
                      {s.title}
                      <span className="text-xs font-medium text-gold-700">{s.when}</span>
                    </h3>
                    <p className="mt-1.5 max-w-md text-[0.9375rem] leading-relaxed text-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            {cta && (
              <div className="mt-8 sm:pl-16">
                <WhatsAppButton location="how-it-works" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// D39: one line instead of a stats grid. The event-count estimate is left out until the customer confirms it.
export function StatsLine({ dark = false }: { dark?: boolean }) {
  return (
    <p className={`text-sm ${dark ? "text-ivory/80" : "text-muted"}`}>
      Since {site.since} · Jubilee Hills, Hyderabad · Open 24 hours
    </p>
  );
}

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
      {faqs.map((f) => (
        <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
            {f.q}
            <ChevronDown className="h-5 w-5 shrink-0 text-gold-700 transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-2 pb-1 text-[0.9375rem] leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
