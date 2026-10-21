import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Star, Truck } from "lucide-react";
import { getService, services, site } from "@/lib/data";
import { CallButton, WhatsAppButton } from "@/components/ContactButtons";
import { DesignsSection } from "@/components/designs/DesignsSection";
import { FaqList, HowItWorks } from "@/components/sections";
import { ServiceCard, ServiceIcon } from "@/components/ui";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return {
    title: service.heroTitle,
    description: `${service.promise} ${site.hours}. Call or WhatsApp Milan Group, Jubilee Hills.`,
    openGraph: service.image ? { images: [`/images/${service.image}.webp`] } : undefined,
  };
}

// Section flow (D40): hero → what you get → for rent → perfect for → how it works → FAQ → enquiry → often booked together.
export default async function ServicePage({ params }: Params) {
  const service = getService((await params).slug);
  if (!service) notFound();

  const flowerContact = service.contactName ? site.contacts.find((c) => c.name === service.contactName) : undefined;
  const whatsappNumber = flowerContact ? site.flowerWhatsApp : undefined;
  const message = `Hi Milan Group, I would like to enquire about ${service.name}.`;
  const related = service.related.map(getService).filter((s) => s !== undefined);
  const faqs = [...service.faqs, ...site.faqs.slice(0, 5 - Math.min(service.faqs.length, 3))];
  const hasStock = service.items.some((i) => i.stock);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* 1. Hero */}
      <section className="relative isolate overflow-hidden bg-forest text-ivory">
        {service.image && (
          <Image src={`/images/${service.image}.webp`} alt={service.name} fill priority sizes="100vw" className="-z-20 object-cover" />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest via-forest/85 to-forest/30" />
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 sm:pb-20">
          <nav aria-label="Breadcrumb" className="text-xs text-ivory/70">
            <Link href="/" className="hover:text-gold">Home</Link><span className="mx-2 text-gold">/</span>
            <Link href="/services/" className="hover:text-gold">Services</Link><span className="mx-2 text-gold">/</span>
            <span className="text-ivory">{service.name}</span>
          </nav>
          <div className="mt-10 max-w-2xl sm:mt-16">
            <p className="eyebrow flex items-center gap-2 !text-gold">
              <ServiceIcon name={service.icon} className="h-4 w-4" /> {service.name}
            </p>
            <h1 className="font-display mt-3 text-4xl leading-[1.08] sm:text-6xl">{service.heroTitle}</h1>
            <p className="mt-5 text-base leading-relaxed text-ivory/85 sm:text-lg">{service.promise}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton location={`service-hero-${service.slug}`} number={whatsappNumber} message={message} />
              <CallButton location={`service-hero-${service.slug}`} callNumber={flowerContact?.phones[0]} tone="dark" />
            </div>
            <ul className="mt-7 flex flex-wrap gap-2 text-xs">
              <li className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-forest/50 px-3 py-1.5"><Clock className="h-3.5 w-3.5 text-gold" /> {site.hours}</li>
              <li className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-forest/50 px-3 py-1.5"><Truck className="h-3.5 w-3.5 text-gold" /> Delivery & set-up</li>
              <li className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-forest/50 px-3 py-1.5"><Star className="h-3.5 w-3.5 text-gold" fill="currentColor" /> {site.rating.value} on Google</li>
              <li className="rounded-full border border-gold/40 bg-forest/50 px-3 py-1.5">Since {site.since}</li>
            </ul>
          </div>
        </div>
        {service.imagePlaceholder && (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] tracking-wide text-white">Representative photo</span>
        )}
      </section>

      {/* 2. What you get */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">What you get</p>
          <h2 className="font-display mt-2 text-4xl text-emerald sm:text-5xl">Everything in {service.name}</h2>
          <p className="mt-4 leading-relaxed text-muted">{service.description}</p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 max-lg:[&>li:last-child:nth-child(odd)]:col-span-2">
          {service.items.map((item) => {
            const body = (
              <>
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f6f1e7]">
                  <Image
                    src={`/images/${item.image}.webp`}
                    alt={item.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className={`${item.image.startsWith("products/") ? "object-contain p-3" : "object-cover"} transition-transform duration-500 group-hover:scale-105`}
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-display text-xl leading-tight text-emerald sm:text-2xl">{item.name}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted sm:text-sm">{item.text}</p>
                  {item.href && <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald group-hover:text-gold-600">See designs <ArrowRight className="h-3.5 w-3.5" /></span>}
                </div>
              </>
            );
            return (
              <li key={item.name} className="group overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-xl hover:shadow-emerald/10">
                {item.href ? <Link href={item.href} className="block h-full">{body}</Link> : body}
              </li>
            );
          })}
        </ul>
        {hasStock && <p className="mt-4 text-xs text-muted">Some photos are representative. Ask us on WhatsApp for photos of our actual stock.</p>}
      </section>

      {/* 3. Designs we have (catalog-backed services only) */}
      {service.catalog.length > 0 && (
        <DesignsSection
          serviceSlug={service.slug}
          serviceName={service.name}
          categories={service.catalog}
          heading={service.designsHeading ?? `${service.name} designs`}
          whatsappNumber={whatsappNumber}
        />
      )}

      {/* 4. Perfect for */}
      <section className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6">
        <p className="eyebrow">Perfect for</p>
        <ul className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-3">
          {service.perfectFor.map((e) => (
            <li key={e} className="rounded-full border border-line bg-white px-5 py-2 text-sm">{e}</li>
          ))}
        </ul>
      </section>

      {/* 5. How it works */}
      <HowItWorks compact />

      {/* 6. Real set-up photos — Phase 2, once the customer sends them */}

      {/* 7. FAQ */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="eyebrow">Questions</p>
          <h2 className="font-display mt-2 text-4xl text-emerald sm:text-5xl">Good to know</h2>
          <p className="mt-4 text-muted">Can&rsquo;t find your answer? Ask us on WhatsApp — we reply quickly.</p>
        </div>
        <FaqList faqs={faqs} />
      </section>

      {/* 8. Enquiry band */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-emerald px-6 py-10 text-ivory sm:px-10 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">Need {service.name.toLowerCase()} for your event?</h2>
            <p className="mt-2 text-sm text-ivory/80">
              {flowerContact
                ? `Talk to ${flowerContact.name}: ${flowerContact.phones.join(" / ")}`
                : "Send us your date and venue — we'll reply with availability and a quote."}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <WhatsAppButton location={`service-band-${service.slug}`} number={whatsappNumber} message={message} />
            <CallButton location={`service-band-${service.slug}`} callNumber={flowerContact?.phones[0]} tone="dark" />
          </div>
        </div>
      </section>

      {/* 9. Often booked together */}
      {related.length > 0 && (
        <section className="border-t border-line bg-champagne/45 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="eyebrow">Plan the full event</p>
            <h2 className="font-display mt-2 text-4xl text-emerald">Often booked together</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => <ServiceCard key={s.slug} service={s} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
