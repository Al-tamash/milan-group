import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { getService, site } from "@/lib/data";
import { RatingBadge } from "@/components/ui";
import { CallButton, WhatsAppButton } from "@/components/ContactButtons";
import { SERVICE_GROUPS } from "@/components/ServiceList";

export const metadata: Metadata = {
  title: "About Milan Group",
  description: "Milan Group (Milan Supplying Company), Jubilee Hills, Hyderabad: tents, chairs, sound, lights and flowers on rent since 1995.",
  alternates: { canonical: "/about/" },
};

// Everything here comes from the business card, catalog cover and existing service copy (D22, D39): no new numbers.
const COUNT_ON = [
  {
    title: "Small orders too",
    text: "Fifty chairs for a pooja at home gets the same team as a full wedding. Rent one thing or the whole set-up.",
  },
  {
    title: "Our own crew on site",
    text: "They deliver, set everything up before your guests arrive, stay till the function ends and clear up after.",
  },
  {
    title: "Here when it matters",
    text: "The office is open every day from 8 am to 10 pm. If something goes wrong at your function after hours, our emergency service runs 24 hours.",
  },
  {
    title: `In Jubilee Hills since ${site.since}`,
    text: "Our office is on Road No. 86. Come and talk to us in person if you'd rather plan face to face.",
  },
];

// Names and roles as on the business card. Numbers stay hidden; the buttons dial or open WhatsApp directly.
const PEOPLE = [
  { name: site.contacts[0].name, role: site.contacts[0].role, phone: site.contacts[0].phones[0], whatsapp: site.enquiryWhatsApp },
  { name: "Asiya Madam", role: site.contacts[1].role, phone: site.contacts[1].phones[0] },
  { name: "Arif", role: site.contacts[4].role, phone: site.contacts[4].phones[0], whatsapp: site.flowerWhatsApp, topic: "wedding flower work" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero: who we are in one breath, with the company motto alongside. No photo here; the story section below
          carries it. */}
      <section className="border-b border-line bg-champagne/45">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
          <div>
            <nav aria-label="Breadcrumb" className="text-[0.8125rem] text-muted">
              <Link href="/" className="hover:text-emerald">Home</Link>
              <span className="mx-2 text-gold">/</span>
              <span aria-current="page">About</span>
            </nav>
            <h1 className="font-display mt-5 text-[2.6rem] leading-[1.05] text-emerald sm:text-5xl xl:text-[3.5rem]">About Milan Group</h1>
            <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-ink/80 sm:text-lg">
              Milan Group, also known as Milan Supplying Company, has been setting up weddings, Nikahs, poojas and
              parties across Hyderabad since {site.since}. Tents, chairs, lights, sound, flowers and kitchen supplies,
              all from one team in Jubilee Hills.
            </p>
          </div>
          <p className="font-display border-l border-gold/60 pl-5 text-3xl leading-tight text-gold-700 sm:text-4xl lg:mb-1">
            {site.motto}
          </p>
        </div>
      </section>

      {/* Story */}
      <section aria-labelledby="story" className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <figure className="relative aspect-[8/5] overflow-hidden rounded-xl lg:order-2">
          <Image
            src="/images/products/german-aluminium-pagoda.webp"
            alt="German aluminium pagoda being set up on site"
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-bottom"
          />
          <figcaption className="absolute bottom-3 left-3 rounded-full bg-forest/85 px-3 py-1.5 text-xs text-ivory backdrop-blur-sm">
            Pagoda set-up on site
          </figcaption>
        </figure>
        <div>
          <h2 id="story" className="font-display text-4xl text-emerald sm:text-5xl">One call instead of five vendors</h2>
          <div className="mt-5 max-w-xl space-y-4 text-[0.9375rem] leading-relaxed text-muted sm:text-base">
            <p>
              We bring together everything an event needs: waterproof tents and pandals, designer chairs and stage sofas,
              cutlery and crockery, sound and DJ, lighting and generators, Calcutta decoration and fresh wedding flower
              work. You don&rsquo;t have to run to five different vendors. We do it ourselves.
            </p>
            <p>
              Our team plans with you, brings everything and sets it up at your venue, stays till the function ends, and
              clears up afterwards.
            </p>
            <p className="border-t border-gold/50 pt-4 text-ink/80">
              Founded in {site.since} by Late Mr. Mohammad Amjad.
            </p>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton location="about" />
            <CallButton location="about" />
          </div>
          <div className="mt-6">
            <RatingBadge />
          </div>
        </div>
      </section>

      {/* What you can count on */}
      <section aria-labelledby="count-on" className="border-t border-line bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 id="count-on" className="font-display text-4xl text-emerald sm:text-5xl">What you can count on</h2>
          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {COUNT_ON.map((c) => (
              <li key={c.title} className="border-t border-gold/60 pt-5">
                <h3 className="font-display text-2xl leading-tight text-emerald">{c.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What we do: grouped links rather than a ten-icon grid, so each service is one tap away. Phones get names
          only; the one-line summaries would double the section's length there. */}
      <section aria-labelledby="what-we-do" className="bg-forest text-ivory">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <h2 id="what-we-do" className="font-display text-4xl sm:text-5xl">What we bring to your event</h2>
            <Link href="/services/" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-gold hover:text-ivory">
              All services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
            {SERVICE_GROUPS.map((g) => (
              <div key={g.name}>
                <h3 className="border-b border-ivory/15 pb-3 text-sm font-semibold text-gold">{g.name}</h3>
                <ul className="divide-y divide-ivory/10">
                  {g.slugs.map(getService).filter((s) => s !== undefined).map((s) => (
                    <li key={s.slug}>
                      <Link href={`/services/${s.slug}/`} className="group flex min-h-12 items-center justify-between gap-4 py-3 md:items-start md:py-4">
                        <span>
                          <span className="font-display block text-[1.375rem] leading-tight text-ivory group-hover:text-gold">{s.name}</span>
                          <span className="mt-1 hidden text-sm leading-relaxed text-ivory/70 md:block">{s.summary}</span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-0.5 md:mt-1.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who you'll talk to: the real contacts, doubling as the closing call to action */}
      <section aria-labelledby="people" className="bg-champagne/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 id="people" className="font-display text-4xl text-emerald sm:text-5xl">Who you&rsquo;ll talk to</h2>
            <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-muted sm:text-base">
              Call Milan Group or Asiya Madam for bookings. Wedding flower work is handled by Arif directly.
            </p>
            <ul className="mt-8 space-y-3 text-[0.9375rem] text-ink/85">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" />
                <span>
                  {site.address.line1},<br />
                  {site.address.line2}
                  <a href={site.mapUrl} target="_blank" rel="noopener" className="mt-1 flex min-h-11 items-center gap-1 font-semibold text-emerald hover:text-gold-700">
                    Get directions <ArrowRight className="h-4 w-4" />
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" />
                <span>
                  {site.hours}
                  <span className="block text-muted">{site.emergency}</span>
                </span>
              </li>
            </ul>
          </div>
          <ul className="divide-y divide-line self-start rounded-xl border border-line bg-white">
            {PEOPLE.map((p) => (
              <li key={p.name} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden
                    className="font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold text-xl text-emerald"
                  >
                    {p.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-lg font-semibold text-ink">{p.name}</span>
                    <span className="block text-sm text-muted">{p.role}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 sm:shrink-0 sm:flex-nowrap [&>a]:whitespace-nowrap">
                  {p.whatsapp && (
                    <WhatsAppButton
                      location={`about-${p.name.toLowerCase()}`}
                      number={p.whatsapp}
                      message={`Hi ${p.name}, I would like to enquire about ${p.topic ?? "an event"}.`}
                    />
                  )}
                  <CallButton location={`about-${p.name.toLowerCase()}`} callNumber={p.phone} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
