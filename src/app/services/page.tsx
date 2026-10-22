import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getService, site, type Service } from "@/lib/data";
import { CallButton, WhatsAppButton } from "@/components/ContactButtons";
import { FaqList } from "@/components/sections";

export const metadata: Metadata = {
  title: "Services",
  description: "Furniture, catering supplies, tents, sound, lighting, Calcutta and wedding flower decoration, theme functions, season articles and flower garlands for events in Hyderabad.",
  alternates: { canonical: "/services/" },
  openGraph: { images: ["/images/home/tents.webp"] },
};

// Real Milan set-ups (not stock). Each photo doubles as a shortcut to the service it shows.
const HERO_SHOTS = [
  { src: "/images/home/tents.webp", label: "Tents", slug: "tents-and-roofing", alt: "Garden tent with draped curtains" },
  { src: "/images/home/tables.webp", label: "Seating", slug: "furniture-and-seating", alt: "Round tables with gold Chiavari chairs" },
  { src: "/images/home/decor.webp", label: "Décor", slug: "wedding-flower-work", alt: "Fairy-light walkway and floral pillars" },
];

// Same three groups as the Home list, but here each service gets room to show what it includes.
const GROUPS = [
  { name: "Set-up", text: "The structure of the function: cover, seating, light and sound.", slugs: ["tents-and-roofing", "furniture-and-seating", "lighting-and-electrical", "sound-and-dj"] },
  { name: "Décor & flowers", text: "Flower work and themed décor for weddings, poojas and parties.", slugs: ["wedding-flower-work", "calcutta-decoration", "theme-functions", "flower-garlands-and-jewellery"] },
  { name: "Supplies", text: "Everything the kitchen and the guests need to get through the day.", slugs: ["catering-and-kitchen", "season-articles"] },
];

// Taken from the booking steps and the delivery FAQ, so nothing here is a new promise.
const INCLUDED = [
  "Delivery to your venue anywhere in Hyderabad",
  "Set-up done before your guests arrive",
  "Our boys stay till the function ends",
  "Everything cleared and picked up after",
];

const FAQ_QUESTIONS = ["How do I get a price?", "Are delivery, set-up and pick-up included?", "How early should I book?"];

function ServiceCard({ service }: { service: Service }) {
  const items = service.items.slice(0, 3).map((i) => i.name);
  return (
    <li>
      <Link
        href={`/services/${service.slug}/`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-colors hover:border-gold"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-champagne">
          {service.image && (
            <Image
              src={`/images/${service.image}.webp`}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )}
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="font-display text-[1.75rem] leading-tight text-emerald">{service.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{service.promise}</p>
          <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-ink/80">
            <span className="font-semibold text-gold-700">Includes </span>
            {items.join(" · ")}
            {service.items.length > 3 && ` + ${service.items.length - 3} more`}
          </p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-emerald">
            See details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </li>
  );
}

export default function ServicesPage() {
  const faqs = site.faqs.filter((f) => FAQ_QUESTIONS.includes(f.q));

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-champagne/45">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_1.25fr] lg:gap-12">
          <div>
            <nav aria-label="Breadcrumb" className="text-xs text-muted">
              <Link href="/" className="hover:text-emerald">Home</Link>
              <span className="mx-2 text-gold">/</span>
              <span aria-current="page">Services</span>
            </nav>
            <h1 className="font-display mt-5 text-balance text-[2.6rem] leading-[1.06] text-emerald sm:text-5xl xl:text-[3.5rem]">
              Ten services, <span className="text-gold-700">one team</span> that sets it all up.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
              Rent only the chairs, or hand us the whole function. Tents, seating, lights, sound, flowers and kitchen
              supplies, all from one place in Jubilee Hills.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton location="services-hero" message="Hi Milan Group, I'd like to know about your services for my event." />
              <CallButton location="services-hero" />
            </div>
            <p className="mt-6 text-sm text-muted">Since {site.since} · Delivery, set-up and pick-up included · {site.hours}</p>
          </div>

          <ul className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {HERO_SHOTS.map((shot, i) => (
              <li key={shot.src}>
                <Link
                  href={`/services/${shot.slug}/`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-xl"
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    {...(i === 1 ? { preload: true } : { loading: "eager" as const })}
                    sizes="(max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-forest/85 px-2.5 py-1 text-xs font-semibold text-ivory backdrop-blur-sm sm:bottom-3 sm:left-3 sm:px-3 sm:py-1.5 sm:text-sm">
                    {shot.label}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Directory */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {GROUPS.map((g, gi) => (
          <section
            key={g.name}
            aria-labelledby={`group-${gi}`}
            className={`grid gap-6 py-14 sm:py-16 lg:grid-cols-[16rem_1fr] lg:gap-12 ${gi > 0 ? "border-t border-line" : ""}`}
          >
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 id={`group-${gi}`} className="font-display text-4xl text-emerald">{g.name}</h2>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{g.text}</p>
            </div>
            <ul className="grid gap-5 md:grid-cols-2">
              {g.slugs.map(getService).filter((s) => s !== undefined).map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* What every booking includes + whole-function enquiry */}
      <section className="bg-forest text-ivory">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl">Comes with every booking</h2>
            <p className="mt-3 max-w-md text-ivory/75">Whether it&rsquo;s fifty chairs or a full wedding, getting it there and putting it up is part of the job.</p>
            <ul className="mt-8 space-y-4">
              {INCLUDED.map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <span className="text-ivory/90">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-center rounded-xl border border-ivory/12 bg-ivory/[0.04] p-6 sm:p-8">
            <h2 className="font-display text-3xl sm:text-4xl">Planning the whole function?</h2>
            <p className="mt-3 text-sm leading-relaxed text-ivory/80">
              Send your date, venue and guest count. We&rsquo;ll work out tents, seating, vessels, lights, sound and
              décor, and give you one rate for all of it.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton location="services-package" message="Hi Milan Group, I'd like a quote for a complete event set-up." />
              <CallButton location="services-package" tone="dark" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick answers */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:gap-12">
        <div>
          <h2 className="font-display text-4xl text-emerald sm:text-5xl">Quick answers</h2>
          <p className="mt-3 text-muted">
            Anything else, <Link href="/contact/" className="font-semibold text-emerald underline underline-offset-4 hover:text-gold-700">ask us directly</Link>.
          </p>
        </div>
        <FaqList faqs={faqs} />
      </section>
    </>
  );
}
