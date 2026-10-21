import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { productImage, products, site } from "@/lib/data";
import { CallButton, WhatsAppButton } from "@/components/ContactButtons";
import { HowItWorks, StatsLine } from "@/components/sections";
import { RatingBadge } from "@/components/ui";
import { ServiceList } from "@/components/ServiceList";
import { OccasionTiles } from "@/components/OccasionTiles";

const COLLAGE = [
  { src: "/images/home/stage.webp", label: "Stage" },
  { src: "/images/home/tents.webp", label: "Tents" },
  { src: "/images/home/tables.webp", label: "Tables & chairs" },
];

export default function Home() {
  const strip = products.filter((p) => p.featured && p.category !== "tents").slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="bg-forest text-ivory">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              Tents, chairs, lights, flowers. <span className="text-gold">One call</span>, we set it all up.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/80 sm:text-lg">
              Weddings, Nikahs, poojas, birthdays — tell us the date and the venue, and our team brings everything and
              puts it up before your guests arrive.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton location="hero" />
              <CallButton location="hero" tone="dark" />
            </div>
            <div className="mt-8 flex flex-col items-start gap-3">
              <RatingBadge dark />
              <StatsLine dark />
            </div>
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-3">
            {COLLAGE.map((c, i) => (
              <figure key={c.label} className={`relative overflow-hidden rounded-lg ${i === 0 ? "row-span-2" : ""}`}>
                <div className={`relative h-full ${i === 0 ? "min-h-72" : "min-h-36"}`}>
                  <Image src={c.src} alt={c.label} fill priority={i === 0} sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
                </div>
                <figcaption className="absolute bottom-2 left-2 rounded bg-forest/80 px-2 py-0.5 text-xs text-ivory">{c.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* What we supply */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-display text-4xl text-emerald sm:text-5xl">What we supply</h2>
        <p className="mt-3 max-w-xl text-muted">Need only chairs? Fine. Need the whole function done? We do that too.</p>
        <div className="mt-10">
          <ServiceList />
        </div>
      </section>

      {/* Chairs & sofas strip */}
      <section className="bg-champagne/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-4xl text-emerald">Our chairs and sofas</h2>
            <Link
              href="/services/furniture-and-seating/#designs"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-emerald hover:text-gold-700"
            >
              See all designs and colours <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <Link href="/services/furniture-and-seating/#designs" className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-8 sm:gap-3">
            {strip.map((p) => (
              <span key={p.slug} className="relative block aspect-[3/4] overflow-hidden rounded-lg bg-[#f6f1e7]">
                <Image src={productImage(p.variants[0].images[0])} alt={p.name} fill sizes="(max-width: 640px) 25vw, 12vw" className="object-contain p-1.5" />
              </span>
            ))}
          </Link>
        </div>
      </section>

      {/* Occasions */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl text-emerald sm:text-5xl">What&rsquo;s the function?</h2>
          <p className="mt-3 text-muted">Pick yours and we&rsquo;ll start the chat on WhatsApp. Not sure what you need? We&rsquo;ll suggest.</p>
        </div>
        <div className="mt-8">
          <OccasionTiles />
        </div>
        <p className="mt-4 text-xs text-muted">Some photos are representative until we add pictures of our own set-ups.</p>
      </section>

      <HowItWorks />

      {/* Contact */}
      <section className="bg-champagne/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl text-emerald sm:text-5xl">Come and see us, or just call</h2>
            <p className="mt-4 text-muted">{site.address.line1}, {site.address.line2}</p>
            <p className="mt-1 text-muted">Open 24 hours. Ask for Amjad or Asiya Madam.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton location="home-contact" />
              <CallButton location="home-contact" />
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-line">
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
