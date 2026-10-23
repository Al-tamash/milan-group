import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/lib/data";
import gallery from "@/data/gallery.json";
import { CallButton, WhatsAppButton } from "@/components/ContactButtons";
import { FaqList, HowItWorks, StatsLine } from "@/components/sections";
import { RatingBadge } from "@/components/ui";
import { ServiceList } from "@/components/ServiceList";
import { OccasionTiles } from "@/components/OccasionTiles";
import { Testimonials } from "@/components/Testimonials";
import { HomeHero } from "@/components/HomeHero";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Real Milan set-up photos for the band under "What we supply". The hero has its own flyer tiles (HomeHero).
const HOME_BAND_IDS = [
  "real-hall-tent",
  "flowers-stage-backdrop",
  "real-palace-tent",
  "real-night-decor",
  "real-lawn-banquet",
  "real-german-hanger",
];
const GALLERY = HOME_BAND_IDS.map((id) => gallery.find((g) => g.id === id)!);

export default function Home() {
  return (
    <>
      <HomeHero />

      {/* Proof right under the hero: Google rating and how long we've been doing this */}
      <div className="border-y border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 px-4 py-4 sm:flex-row sm:gap-6 sm:px-6">
          <RatingBadge />
          <StatsLine />
        </div>
      </div>

      {/* What we supply */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-display text-4xl text-emerald sm:text-5xl">What we supply</h2>
        <p className="mt-3 max-w-xl text-muted">Need only chairs? Fine. Need the whole function done? We do that too.</p>
        <div className="mt-10">
          <ServiceList />
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-forest py-16 text-ivory sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl">Some of our set-ups</h2>
              <p className="mt-3 text-ivory/75">More photos from recent functions on our Instagram.</p>
            </div>
            <Link href="/gallery/" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-gold hover:text-ivory">
              See the gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {GALLERY.map((g, i) => (
              <figure
                key={g.src}
                className={`relative overflow-hidden rounded-lg ${i === 0 ? "col-span-2 aspect-[4/3] lg:col-span-1 lg:aspect-[3/4]" : "aspect-[3/4]"}`}
              >
                <Image src={g.src} alt={g.caption} fill sizes={i === 0 ? "(max-width: 1024px) 100vw, 33vw" : "(max-width: 1024px) 50vw, 33vw"} className="object-cover" />
              </figure>
            ))}
          </div>
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
      </section>

      <HowItWorks cta />

      <Testimonials />

      {/* FAQ */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:gap-12">
        <div>
          <h2 className="font-display text-4xl text-emerald sm:text-5xl">Before you call</h2>
          <p className="mt-3 text-muted">The things people usually ask us first.</p>
        </div>
        <FaqList faqs={site.faqs} />
      </section>

      {/* Contact */}
      <section className="bg-champagne/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl text-emerald sm:text-5xl">Come and see us, or just call</h2>
            <p className="mt-4 text-muted">{site.address.line1}, {site.address.line2}</p>
            <p className="mt-1 text-muted">{site.hours}. Emergency service 24 hours. Ask for Asiya Madam.</p>
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
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </>
  );
}
