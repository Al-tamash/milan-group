import type { Metadata } from "next";
import { services, site } from "@/lib/data";
import { PageHero, ServiceCard } from "@/components/ui";
import { CallButton, WhatsAppButton } from "@/components/ContactButtons";

export const metadata: Metadata = {
  title: "Services",
  description: "Furniture, catering supplies, tents, sound, lighting, Calcutta and wedding flower decoration, theme functions, season articles and flower garlands for events in Hyderabad.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow={`Our services · since ${site.since}`}
        title="The complete set-up solution"
        intro="Ten services, one team. Pick what you need — or let us handle the whole event."
        crumbs={[{ href: "/", label: "Home" }, { href: "/services/", label: "Services" }]}
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => <ServiceCard key={s.slug} service={s} />)}
          {/* Fills the last row (10 cards + this 2-wide card = 3 full rows of 4). */}
          <div className="flex flex-col justify-center rounded-2xl bg-emerald p-8 text-ivory sm:col-span-2">
            <p className="eyebrow !text-gold">Full event package</p>
            <h2 className="font-display mt-2 text-3xl sm:text-4xl">Planning the whole event?</h2>
            <p className="mt-3 text-sm text-ivory/80">Tell us your date, venue and guest count — we&rsquo;ll put together tents, seating, catering supplies, lighting, sound and décor in one quote.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton location="services-package" message="Hi Milan Group, I'd like a quote for a complete event set-up." />
              <CallButton location="services-package" tone="dark" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
