import type { Metadata } from "next";
import Image from "next/image";
import { services, site } from "@/lib/data";
import { PageHero, RatingBadge, ServiceIcon } from "@/components/ui";
import { CallButton, WhatsAppButton } from "@/components/ContactButtons";

export const metadata: Metadata = {
  title: "About Us",
  description: "Milan Group (Milan Supplying Company), Jubilee Hills, Hyderabad — event rentals and the complete set-up solution.",
};

// D39: "since 1995" came from the developer; the event count in site.stats is an estimate for the customer
// preview and must be confirmed before go-live (docs/content-review.md).
export default function AboutPage() {
  return (
    <>
      <PageHero
        title="We deliver, you celebrate"
        crumbs={[{ href: "/", label: "Home" }, { href: "/about/", label: "About" }]}
      />
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div className="space-y-5 leading-relaxed text-muted">
          <p className="font-display text-3xl leading-snug text-emerald">
            Milan Group — also known as Milan Supplying Company — has been an event rental and supplying company in
            Hyderabad since {site.since}.
          </p>
          <p>
            We bring together everything an event needs: waterproof tents and pandals, designer chairs and stage sofas,
            cutlery and crockery, sound and DJ, lighting and generators, Calcutta decoration and fresh wedding flower work.
            You don&rsquo;t have to run to five different vendors &mdash; we do it ourselves.
          </p>
          <p>
            Our team plans with you, brings everything and sets it up at your venue, stays till the function ends, and
            clears up afterwards. You can call us any time, day or night.
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <WhatsAppButton location="about" />
            <CallButton location="about" />
          </div>
          <RatingBadge />
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
          <Image src="/images/home/stage.webp" alt="Stage set-up by Milan Group" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>
      </section>
      <section className="bg-forest py-16 text-ivory">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-center text-4xl">What we bring to your event</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {services.map((s) => (
              <li key={s.slug} className="flex items-start gap-3">
                <span className="text-gold"><ServiceIcon name={s.icon} /></span>
                <span>
                  <span className="block font-semibold">{s.name}</span>
                  <span className="text-sm text-ivory/70">{s.summary}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
