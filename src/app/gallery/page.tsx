import type { Metadata } from "next";
import { Instagram } from "lucide-react";
import { gallery, services, site } from "@/lib/data";
import { PageHero } from "@/components/ui";
import { WhatsAppButton } from "@/components/ContactButtons";
import { GalleryView } from "@/components/gallery/GalleryView";

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
                Follow @{site.instagramHandle} on Instagram for live stories and recent function photos.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-emerald px-6 py-2.5 text-sm font-semibold text-emerald hover:bg-emerald hover:text-ivory transition-colors"
              >
                <Instagram className="h-4 w-4" /> Open Instagram
              </a>
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
