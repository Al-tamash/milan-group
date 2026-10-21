import Image from "next/image";
import Link from "next/link";
import {
  Armchair, Fan, Flower2, Gem, Lightbulb, PartyPopper, Speaker, Star, Tent, Heart, UtensilsCrossed, type LucideIcon,
} from "lucide-react";
import { productHref, productImage, site, type Product, type Service } from "@/lib/data";

const ICONS: Record<string, LucideIcon> = {
  chair: Armchair, tent: Tent, speaker: Speaker, bulb: Lightbulb, flower: Flower2,
  rings: Heart, balloon: PartyPopper, fan: Fan, gem: Gem, utensils: UtensilsCrossed,
};

export function ServiceIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Star;
  return <Icon className={className} strokeWidth={1.5} />;
}

export function SectionHeading({ eyebrow, title, intro, center = true }: { eyebrow?: string; title: string; intro?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="font-display mt-2 text-4xl text-emerald sm:text-5xl">{title}</h2>
      <div className={`gold-rule mt-4 w-32 ${center ? "mx-auto" : ""}`} />
      {intro && <p className="mt-5 text-base leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, intro, crumbs }: { eyebrow?: string; title: string; intro?: string; crumbs?: { href: string; label: string }[] }) {
  return (
    <section className="border-b border-line bg-champagne/45">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted">
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

export function ProductCard({ product }: { product: Product }) {
  const first = product.variants[0];
  return (
    <Link
      href={productHref(product)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-xl hover:shadow-emerald/10"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f6f1e7]">
        <Image
          src={productImage(first.images[0])}
          alt={`${product.name} – ${first.name}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-2xl leading-tight text-emerald">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted">{product.tagline}</p>
        {product.variants.length > 1 && (
          <div className="mt-auto flex items-center gap-1.5 pt-3">
            {product.variants.slice(0, 7).map((v) => (
              <span key={v.name} title={v.name} className="h-3.5 w-3.5 rounded-full border border-black/15" style={{ background: v.swatch }} />
            ))}
            <span className="ml-1 text-[11px] text-muted">{product.variants.length} colours</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export function ServiceImage({ service, className = "", label = true }: { service: Service; className?: string; label?: boolean }) {
  if (service.image) {
    return (
      <>
        <Image
          src={`/images/${service.image}.webp`}
          alt={service.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`object-cover ${className}`}
        />
        {/* Stock photo (D10): labelled so it isn't mistaken for Milan Group's own work. */}
        {label && service.imagePlaceholder && (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2.5 py-1 text-[10px] tracking-wide text-white">
            Representative photo
          </span>
        )}
      </>
    );
  }
  // Placeholder until the customer sends photos (D10).
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-emerald to-forest text-gold">
      <ServiceIcon name={service.icon} className="h-14 w-14" />
      <span className="text-[11px] uppercase tracking-[0.25em] text-ivory/70">Photos coming soon</span>
    </div>
  );
}

export function ServiceCard({ service, compact = false }: { service: Service; compact?: boolean }) {
  return (
    <Link
      href={`/services/${service.slug}/`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-xl hover:shadow-emerald/10"
    >
      <div className={`relative overflow-hidden ${compact ? "aspect-[4/3]" : "aspect-[16/10]"}`}>
        <ServiceImage service={service} label={!compact} className="transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <div className="flex items-start gap-2 text-gold-600">
          <ServiceIcon name={service.icon} className="mt-1 h-5 w-5 shrink-0" />
          <h3 className={`font-display leading-tight text-emerald ${compact ? "text-xl" : "text-2xl"}`}>{service.name}</h3>
        </div>
        <p className={`mt-2 leading-relaxed text-muted ${compact ? "line-clamp-3 text-xs" : "text-sm"}`}>{service.summary}</p>
        <span className="mt-auto pt-4 text-sm font-semibold text-emerald group-hover:text-gold-600">Explore →</span>
      </div>
    </Link>
  );
}

export function RatingBadge({ dark = false }: { dark?: boolean }) {
  return (
    <a
      href={site.mapUrl}
      target="_blank"
      rel="noopener"
      className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm ${
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
      </span>
    </a>
  );
}
