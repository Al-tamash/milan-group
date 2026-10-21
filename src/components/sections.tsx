import { ChevronDown, ClipboardList, Handshake, ShieldCheck, Wrench } from "lucide-react";
import { site, type Faq } from "@/lib/data";

const STEPS = [
  { icon: ClipboardList, title: "Planning", text: "Tell us your date, venue and guest count. We suggest the right set-up." },
  { icon: Handshake, title: "Set-up", text: "Our team delivers and installs everything at your venue, on time." },
  { icon: Wrench, title: "Execution", text: "Our crew stays on hand so everything runs smoothly." },
  { icon: ShieldCheck, title: "Support", text: "24-hour support, and we clear up after the celebration." },
];

export function HowItWorks({ compact = false }: { compact?: boolean }) {
  return (
    <section className="bg-forest py-16 text-ivory sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow !text-gold">How it works</p>
          <h2 className="font-display mt-2 text-4xl sm:text-5xl">{compact ? "Four simple steps" : "From plan to celebration"}</h2>
          <div className="gold-rule mx-auto mt-4 w-32" />
        </div>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/60 text-gold">
                <s.icon className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <p className="mt-4 text-xs tracking-[0.3em] text-gold">STEP {i + 1}</p>
              <h3 className="font-display mt-1 text-3xl">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory/75">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// D39: "since 1995" is from the developer; the event count is an estimate pending customer confirmation.
export function StatsStrip({ dark = false }: { dark?: boolean }) {
  return (
    <dl className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl border sm:grid-cols-4 ${dark ? "border-gold/30 bg-gold/30" : "border-line bg-line"}`}>
      {site.stats.map((s) => (
        <div key={s.label} className={`flex flex-col-reverse px-4 py-5 text-center ${dark ? "bg-forest" : "bg-white"}`}>
          <dt className={`text-xs uppercase tracking-[0.15em] ${dark ? "text-ivory/70" : "text-muted"}`}>{s.label}</dt>
          <dd className={`font-display text-4xl ${dark ? "text-gold" : "text-emerald"}`}>{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
      {faqs.map((f) => (
        <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
            {f.q}
            <ChevronDown className="h-5 w-5 shrink-0 text-gold-600 transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
