import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getService, products, services, site, type Feature } from "@/lib/data";
import { AskLink, CallButton, WhatsAppButton } from "@/components/ContactButtons";
import { DesignsSection } from "@/components/designs/DesignsSection";
import { FaqList, HowItWorks } from "@/components/sections";
import { ServiceIcon } from "@/components/ui";

export const dynamicParams = false;

// Desktop grid has 6 tracks so rows always fill: 5 items -> 2 wide + 3, 4 -> 2 + 2, 7 -> 1 full + 3 + 3, multiples of 3 stay even.
function itemSpan(i: number, n: number) {
  if (n % 3 === 0) return "lg:col-span-2";
  if (n === 4) return "lg:col-span-3";
  if (n % 3 === 2) return i < 2 ? "lg:col-span-3" : "lg:col-span-2";
  return i === 0 ? "lg:col-span-6" : "lg:col-span-2";
}

function PhotoLabel({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <figcaption className={`absolute rounded-full bg-forest/85 px-2.5 py-1 text-xs font-medium text-ivory backdrop-blur-sm ${className}`}>
      {children}
    </figcaption>
  );
}

// Some catalog sheets use one-word headings ("Structure", "Canopy"); for those the first phrase of the text says more.
const featureLabel = (f: Feature) => (f.title.includes(" ") ? f.title : f.text.split(/\s[—(]/)[0].replace(/\.$/, ""));
export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  const heroPhoto = service.heroImage?.src ?? service.image;
  return {
    title: service.heroTitle,
    description: `${service.promise} ${site.hours}. Call or WhatsApp Milan Group, Jubilee Hills.`,
    alternates: { canonical: `/services/${service.slug}/` },
    openGraph: heroPhoto ? { images: [`/images/${heroPhoto}.webp`] } : undefined,
  };
}

// Section flow (D40): hero (with who it's for) → what you get → sizes (tents) → designs → how it works → FAQ → enquiry
// → often booked together.
export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const service = getService((await params).slug);
  if (!service) notFound();

  const flowerContact = service.contactName ? site.contacts.find((c) => c.name === service.contactName) : undefined;
  const whatsappNumber = flowerContact ? site.flowerWhatsApp : undefined;
  const message = `Hi Milan Group, I would like to enquire about ${service.name}.`;
  const related = service.related.map(getService).filter((s) => s !== undefined);
  const faqs = [...service.faqs, ...site.faqs.slice(0, 5 - Math.min(service.faqs.length, 3))];
  const hero = service.heroImage ?? (service.image ? { src: service.image, alt: service.name } : null);
  const inset = hero ? service.heroInset : undefined;
  // Sizes come straight from the catalog sheets; only tents have measured sizes worth comparing side by side.
  const sized = service.catalog.includes("tents") ? products.filter((p) => p.category === "tents" && p.dimensions.length > 0) : [];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* 1. Hero */}
      <section className="bg-forest text-ivory">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 pt-6 sm:px-6 sm:pb-16 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:pb-20 lg:pt-8">
          <div>
            <nav aria-label="Breadcrumb" className="text-xs text-ivory/70">
              <Link href="/" className="hover:text-gold">Home</Link><span className="mx-2 text-gold">/</span>
              <Link href="/services/" className="hover:text-gold">Services</Link><span className="mx-2 text-gold">/</span>
              <span aria-current="page" className="text-ivory">{service.name}</span>
            </nav>
            <h1 className="font-display mt-7 max-w-xl text-balance text-[2.5rem] leading-[1.04] sm:text-[3.25rem] lg:mt-12 xl:text-[3.75rem]">
              {service.heroTitle}
            </h1>
            <p className="mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-ivory/85 sm:text-lg">{service.promise}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton location={`service-hero-${service.slug}`} number={whatsappNumber} message={message} />
              <CallButton location={`service-hero-${service.slug}`} callNumber={flowerContact?.phones[0]} tone="dark" />
            </div>
            <dl className="mt-8 grid max-w-lg grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 border-t border-ivory/15 pt-5 text-sm leading-relaxed sm:gap-x-6">
              <dt className="font-medium text-gold">Booked for</dt>
              <dd className="text-ivory/85">{service.perfectFor.join(", ")}</dd>
              <dt className="font-medium text-gold">Every order</dt>
              <dd className="text-ivory/85">Delivery, set-up and pick-up included · Since {site.since}</dd>
            </dl>
          </div>
          {/* A second real photo overlaps the main one on desktop only. Its 16:10 frame is wider than the photo, so with
              object-bottom the title printed at the top of catalog shots falls outside; phones get the main photo alone. */}
          {hero && (
            <div className="relative w-full lg:max-w-md lg:justify-self-end">
              <figure className="relative aspect-[16/11] overflow-hidden rounded-xl sm:aspect-[16/10] lg:aspect-[4/5]">
                <Image src={`/images/${hero.src}.webp`} alt={hero.alt} fill preload sizes="(max-width: 1024px) 100vw, 448px" className="object-cover" />
                {hero.label && <PhotoLabel className="right-2.5 top-2.5 sm:right-3 sm:top-3">{hero.label}</PhotoLabel>}
              </figure>
              {inset && (
                <figure className="absolute -left-16 bottom-10 hidden aspect-[16/10] w-[70%] overflow-hidden rounded-lg ring-[6px] ring-forest lg:block">
                  <Image src={`/images/${inset.src}.webp`} alt={inset.alt} fill sizes="320px" className="object-cover object-bottom" />
                  {inset.label && <PhotoLabel className="bottom-2.5 left-2.5 sm:bottom-3 sm:left-3">{inset.label}</PhotoLabel>}
                </figure>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 2. What you get */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl text-emerald sm:text-5xl">What you get</h2>
          <p className="mt-4 leading-relaxed text-muted">{service.description}</p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-6 lg:gap-y-10 max-lg:[&>li:last-child:nth-child(odd)]:col-span-2">
          {service.items.map((item, i) => {
            const span = itemSpan(i, service.items.length);
            const wide = span !== "lg:col-span-2";
            const body = (
              <>
                <div className={`relative overflow-hidden rounded-xl bg-champagne ${wide ? "aspect-[4/3] lg:aspect-[16/10]" : "aspect-[4/3]"}`}>
                  <Image
                    src={`/images/${item.image}.webp`}
                    alt={item.name}
                    fill
                    sizes={wide ? "50vw" : "(max-width: 1024px) 50vw, 33vw"}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="pt-4">
                  <h3 className="font-display text-[1.375rem] leading-tight text-emerald sm:text-[1.625rem]">{item.name}</h3>
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted sm:text-[0.9375rem]">{item.text}</p>
                  {item.href ? (
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald group-hover:text-gold-700">
                      See the designs <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  ) : (
                    <AskLink
                      location={`service-item-${service.slug}`}
                      number={whatsappNumber}
                      message={`Hi Milan Group, I'd like to know about ${item.name} (${service.name}).`}
                    />
                  )}
                </div>
              </>
            );
            return (
              <li key={item.name} className={`group ${span}`}>
                {item.href ? <Link href={item.href} className="block h-full">{body}</Link> : body}
              </li>
            );
          })}
        </ul>
      </section>

      {/* 3. Sizes at a glance (tents only) */}
      {sized.length > 0 && (
        <section aria-labelledby="sizes" className="border-t border-line">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 id="sizes" className="font-display text-4xl text-emerald sm:text-5xl">Sizes at a glance</h2>
            <p className="mt-3 max-w-xl text-muted">
              From our catalog sheets. Pipe pandal, shamiyana and gazebo sizes aren&rsquo;t listed yet, so ask us on WhatsApp.
            </p>
            {/* Phones: one swipeable card per tent (the four stacked rows ran past 1,500px). From md up: a plain table. */}
            <ul className="review-rail -mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 md:hidden">
              {sized.map((p) => (
                <li key={p.slug} className="w-[84%] shrink-0 snap-start rounded-xl border border-line bg-white p-5">
                  <h3 className="font-display text-[1.375rem] font-semibold leading-tight text-emerald">{p.name}</h3>
                  <dl className="mt-3 space-y-2.5 text-[0.9375rem] leading-relaxed">
                    <div>
                      <dt className="text-xs font-semibold text-gold-700">Size</dt>
                      <dd className="text-ink">
                        {p.dimensions.map((d) => (
                          <span key={d.label} className="block tabular-nums">
                            {p.dimensions.length > 1 && <span className="text-muted">{d.label}: </span>}
                            {d.value}
                          </span>
                        ))}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-gold-700">Built with</dt>
                      <dd className="text-ink/85">{p.features.map(featureLabel).join(" · ")}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-gold-700">Good for</dt>
                      <dd className="text-ink/85">{p.suitedFor.join(", ")}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
            <div className="mt-10 hidden overflow-hidden rounded-xl border border-line bg-white md:block">
              <table className="w-full text-left text-[0.9375rem] leading-relaxed">
                <thead className="border-b border-line bg-champagne/50 text-sm text-ink">
                  <tr>
                    <th scope="col" className="w-[24%] px-6 py-3.5 font-semibold">Tent</th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">Size</th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">Built with</th>
                    <th scope="col" className="w-[22%] px-6 py-3.5 font-semibold">Good for</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {sized.map((p) => (
                    <tr key={p.slug} className="align-top">
                      <th scope="row" className="font-display px-6 py-5 text-[1.375rem] font-semibold leading-tight text-emerald">{p.name}</th>
                      <td className="whitespace-nowrap px-6 py-5 text-ink">
                        {p.dimensions.map((d) => (
                          <span key={d.label} className="block tabular-nums">
                            {p.dimensions.length > 1 && <span className="text-muted">{d.label}: </span>}
                            {d.value}
                          </span>
                        ))}
                      </td>
                      <td className="px-6 py-5 text-ink/85">{p.features.map(featureLabel).join(" · ")}</td>
                      <td className="px-6 py-5 text-ink/85">{p.suitedFor.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

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

      {/* 5. How it works */}
      <HowItWorks photo={false} />

      {/* 6. Real set-up photos — Phase 2, once the customer sends them */}

      {/* 7. FAQ */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <h2 className="font-display text-4xl text-emerald sm:text-5xl">Questions people ask</h2>
          <p className="mt-4 text-muted">Can&rsquo;t find your answer? Ask us on WhatsApp — we reply quickly.</p>
        </div>
        <FaqList faqs={faqs} />
      </section>

      {/* 8. Enquiry band */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-xl bg-emerald px-6 py-10 text-ivory sm:px-10 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">Need {service.name.toLowerCase()} for your event?</h2>
            <p className="mt-2 text-sm text-ivory/80">
              {flowerContact
                ? `Our flower work is handled by ${flowerContact.name}. Call or WhatsApp him directly.`
                : "Send us your date and venue — we'll reply with availability and a quote."}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <WhatsAppButton location={`service-band-${service.slug}`} number={whatsappNumber} message={message} />
            <CallButton location={`service-band-${service.slug}`} callNumber={flowerContact?.phones[0]} tone="dark" />
          </div>
        </div>
      </section>

      {/* 9. Often booked together: photo + one line each, so people can tell the services apart before clicking.
          Compact rows on phones, photo-on-top cards from md up. */}
      {related.length > 0 && (
        <section aria-labelledby="related" className="border-t border-line bg-champagne/45 py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <div>
                <h2 id="related" className="font-display text-3xl text-emerald sm:text-4xl">Usually booked with this</h2>
                <p className="mt-2 text-[0.9375rem] text-muted">Add these to the same enquiry and we&rsquo;ll quote them together.</p>
              </div>
              <Link href="/services/" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-emerald hover:text-gold-700">
                All services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-3">
              {related.map((s) => {
                const photo = s.heroImage?.src ?? s.image;
                return (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}/`}
                      className="group flex h-full items-center gap-4 overflow-hidden rounded-xl border border-line bg-white p-3 pr-4 transition-colors hover:border-gold md:flex-col md:items-stretch md:gap-0 md:p-0"
                    >
                      <span className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-champagne md:aspect-[16/9] md:h-auto md:w-full md:rounded-none">
                        {photo ? (
                          <Image
                            src={`/images/${photo}.webp`}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 96px, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <ServiceIcon name={s.icon} className="absolute inset-0 m-auto h-7 w-7 text-gold-700" />
                        )}
                      </span>
                      <span className="flex min-w-0 flex-1 items-center gap-3 md:items-start md:p-5">
                        <span className="min-w-0 flex-1">
                          <span className="font-display block text-[1.375rem] leading-tight text-emerald">{s.name}</span>
                          <span className="mt-1 line-clamp-2 text-sm leading-snug text-muted">{s.summary}</span>
                        </span>
                        <ArrowRight className="h-5 w-5 shrink-0 text-gold-700 transition-transform group-hover:translate-x-0.5 md:mt-1" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
