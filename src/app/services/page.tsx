import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { ServiceList } from "@/components/ServiceList";
import { CallButton, WhatsAppButton } from "@/components/ContactButtons";

export const metadata: Metadata = {
  title: "Services",
  description: "Furniture, catering supplies, tents, sound, lighting, Calcutta and wedding flower decoration, theme functions, season articles and flower garlands for events in Hyderabad.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Everything we rent out"
        intro="Ten kinds of work, one team. Take only what you need, or let us do the whole function."
        crumbs={[{ href: "/", label: "Home" }, { href: "/services/", label: "Services" }]}
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <ServiceList headingAs="h2" />
      </section>
      <section className="bg-emerald text-ivory">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl">Planning the whole function?</h2>
            <p className="mt-3 text-sm text-ivory/80">Send your date, venue and guest count. We&rsquo;ll work out tents, seating, vessels, lights, sound and décor, and give you one rate for all of it.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton location="services-package" message="Hi Milan Group, I'd like a quote for a complete event set-up." />
              <CallButton location="services-package" tone="dark" />
          </div>
        </div>
      </section>
    </>
  );
}
