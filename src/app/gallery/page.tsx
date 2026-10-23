import type { Metadata } from "next";
import { gallery, services } from "@/lib/data";
import { PageHero } from "@/components/ui";
import { WhatsAppButton } from "@/components/ContactButtons";
import { GalleryView } from "@/components/gallery/GalleryView";
import { SocialLinks } from "@/components/SocialLinks";

export const metadata: Metadata = {
  title: "Gallery — Event Set-ups & Décor in Hyderabad",
  description:
    "Photos of German hangars, pagoda tents, wedding stages, royal velvet seating, and event décor set up by Milan Group in Hyderabad.",
  alternates: { canonical: "/gallery/" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        title="Our set-ups & events"
        intro="German hangars, pagoda tents, wedding stages, luxury seating, and event décor set up by Milan Group across Hyderabad."
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/gallery/", label: "Gallery" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <GalleryView items={gallery} services={services} />

        <div className="mt-16 border-t border-line pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl text-emerald sm:text-3xl">
                Looking for photos from our newest events?
              </h2>
              <p className="mt-1 text-sm text-muted">
                Follow us on Instagram, Facebook and YouTube for recent function photos.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <SocialLinks tone="light" exclude={["whatsapp-channel"]} />
              <WhatsAppButton
                location="gallery"
                message="Hi Milan Group, I saw your gallery and would like to enquire about setup availability for an event."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
