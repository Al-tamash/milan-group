import Image from "next/image";
import Link from "next/link";
import { services, site } from "@/lib/data";
import { CallButton, WhatsAppButton } from "@/components/ContactButtons";
import { HowItWorks, StatsLine } from "@/components/sections";
import { RatingBadge, SectionHeading, ServiceCard } from "@/components/ui";

const EVENTS = ["Weddings", "Receptions", "Engagements", "Nikah", "Haldi & Mehendi", "Birthdays", "Get-togethers", "Inaugurations", "Pooja & festivals", "Corporate events"];

const HERO_TILES = [
  { src: "/images/home/tents.webp", label: "Tents" },
  { src: "/images/home/stage.webp", label: "Stage" },
  { src: "/images/home/tables.webp", label: "Tables & Chairs" },
  { src: "/images/home/decor.webp", label: "Décor & Lighting" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest text-ivory">
        <div className="absolute inset-0 opacity-25">
          <Image src="/images/home/decor.webp" alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/90 to-forest/40" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="eyebrow !text-gold">Event rentals since {site.since} · Jubilee Hills, Hyderabad</p>
            <h1 className="font-display mt-4 text-5xl leading-[1.05] sm:text-7xl">
              The complete <span className="text-gold">set-up</span> solution
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/80 sm:text-lg">
              Tents, designer chairs, stage sofas, sound, lighting and flower décor — everything for your wedding or
              celebration, delivered and set up by one team.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton location="hero" />
              <CallButton location="hero" tone="dark" />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <RatingBadge dark />
              <span className="text-sm text-gold">{site.hours}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {HERO_TILES.map((t, i) => (
              <figure key={t.label} className={`relative overflow-hidden rounded-t-[999px] rounded-b-xl border border-gold/40 ${i % 2 ? "mt-8" : ""}`}>
                <div className="relative aspect-[3/4]">
                  <Image src={t.src} alt={t.label} fill sizes="(max-width: 1024px) 50vw, 22vw" className="object-cover" />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-center text-xs font-semibold uppercase tracking-[0.2em]">
                  {t.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Stats (D39) */}
      <section className="mx-auto -mt-px max-w-7xl px-4 pt-10 sm:px-6">
        <StatsLine />
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="What we do"
          title="Everything for your event, under one roof"
          intro="From the first tent pole to the last flower garland — choose a service to see everything it includes."
        />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-5">
          {services.map((s) => <ServiceCard key={s.slug} service={s} compact />)}
        </div>
      </section>

      <HowItWorks />

      {/* Events */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="Occasions" title="Every celebration we set up" />
        <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
          {EVENTS.map((e) => (
            <li key={e} className="rounded-full border border-line bg-white px-5 py-2 text-sm text-ink">{e}</li>
          ))}
        </ul>
      </section>

      {/* Contact strip */}
      <section className="border-t border-line bg-champagne/45">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Visit or call</p>
            <h2 className="font-display mt-2 text-4xl text-emerald sm:text-5xl">Plan your event with us</h2>
            <p className="mt-4 text-muted">{site.address.line1}, {site.address.line2}</p>
            <p className="mt-1 font-semibold text-emerald">{site.hours}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton location="home-contact" />
              <CallButton location="home-contact" />
            </div>
            <div className="mt-6"><RatingBadge /></div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-line">
            <iframe
              title="Milan Group on Google Maps"
              src={site.mapEmbed}
              className="h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
