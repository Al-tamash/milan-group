import { ChevronDown, ClipboardList, Handshake, ShieldCheck, Wrench } from "lucide-react";
import { site, type Faq } from "@/lib/data";

const STEPS = [
  { icon: ClipboardList, title: "Planning", text: "Send your date, venue and guest count on WhatsApp. We suggest what you need." },
  { icon: Handshake, title: "Set-up", text: "Our team brings everything and sets it up before your guests arrive." },
  { icon: Wrench, title: "Execution", text: "Our boys stay at the venue till the function ends, in case anything is needed." },
  { icon: ShieldCheck, title: "Support", text: "Call any time, day or night. We clear everything up after." },
];

// The four words come from Milan Group's own catalog cover. A quiet strip, not a full-width feature band.
export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works" className="border-y border-line">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h2 id="how-it-works" className="text-sm font-semibold text-ink">How booking works</h2>
        <ol className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.title} className="flex gap-3">
              <s.icon className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" strokeWidth={1.5} />
              <p className="text-sm leading-relaxed text-muted">
                <span className="font-semibold text-ink">{s.title}.</span> {s.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// D39: one line instead of a stats grid. The event-count estimate is left out until the customer confirms it.
export function StatsLine({ dark = false }: { dark?: boolean }) {
  return (
    <p className={`text-sm ${dark ? "text-ivory/80" : "text-muted"}`}>
      Since {site.since} · Jubilee Hills, Hyderabad · Open 24 hours · {site.rating.value}★ on Google
    </p>
  );
}

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
      {faqs.map((f) => (
        <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
            {f.q}
            <ChevronDown className="h-5 w-5 shrink-0 text-gold-700 transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
