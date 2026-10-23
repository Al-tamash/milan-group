import Link from "next/link";
import {
  Armchair, BadgeCheck, Fan, Flower2, Gem, Lightbulb, PartyPopper, Speaker, Star, Tent, Heart, UtensilsCrossed, type LucideIcon,
} from "lucide-react";
import { site } from "@/lib/data";

const ICONS: Record<string, LucideIcon> = {
  chair: Armchair, tent: Tent, speaker: Speaker, bulb: Lightbulb, flower: Flower2,
  rings: Heart, balloon: PartyPopper, fan: Fan, gem: Gem, utensils: UtensilsCrossed,
};

export function ServiceIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Star;
  return <Icon className={className} strokeWidth={1.5} />;
}

type SectionHeadingProps = { eyebrow?: string; title: string; intro?: string; align?: "left" | "center"; rule?: boolean };

// Plain heading by default: no label above it, no gold rule, left-aligned. Opt in only where a page needs it.
export function SectionHeading({ eyebrow, title, intro, align = "left", rule = false }: SectionHeadingProps) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h2 className="font-display text-4xl text-emerald sm:text-5xl">{title}</h2>
      {rule && <div className={`gold-rule mt-4 w-32 ${center ? "mx-auto" : ""}`} />}
      {intro && <p className="mt-4 text-base leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, intro, crumbs }: { eyebrow?: string; title: string; intro?: string; crumbs?: { href: string; label: string }[] }) {
  return (
    <section className="border-b border-line bg-champagne/45">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-4 text-[0.8125rem] text-muted">
            {crumbs.map((c, i) => (
              <span key={c.href}>
                <Link href={c.href} className="hover:text-emerald">{c.label}</Link>
                {i < crumbs.length - 1 && <span className="mx-2 text-gold">/</span>}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="font-display mt-2 text-4xl text-emerald sm:text-6xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{intro}</p>}
      </div>
    </section>
  );
}

export function RatingBadge({ dark = false }: { dark?: boolean }) {
  return (
    <a
      href={site.mapUrl}
      target="_blank"
      rel="noopener"
      className={`inline-flex min-h-11 items-center gap-3 rounded-full border px-4 py-2 text-sm ${
        dark ? "border-gold/40 text-ivory hover:bg-ivory/10" : "border-line bg-white text-ink hover:border-gold"
      }`}
    >
      <span className="flex text-gold">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-4 w-4" fill={i < Math.round(site.rating.value) ? "currentColor" : "none"} />
        ))}
      </span>
      <span>
        <strong>{site.rating.value}</strong> · {site.rating.count} Google reviews
        <span className={`flex items-center gap-1 text-xs font-semibold ${dark ? "text-gold" : "text-emerald"}`}>
          <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified on Google
        </span>
      </span>
    </a>
  );
}
