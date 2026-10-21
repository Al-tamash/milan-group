import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/lib/data";
import gallery from "@/data/gallery.json";
import { PageHero } from "@/components/ui";
import { WhatsAppButton } from "@/components/ContactButtons";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos of tents, stages, seating and décor set up by Milan Group in Hyderabad.",
};

// Phase 1: the few real set-up photos we have (shared with the home page). Add event photos to gallery.json as the customer sends them.
const PHOTOS = gallery;

export default function GalleryPage() {
  return (
    <>
      <PageHero
        title="Our set-ups"
        intro="A glimpse of the tents, stages and seating we set up. More photos from recent events are coming soon."
        crumbs={[{ href: "/", label: "Home" }, { href: "/gallery/", label: "Gallery" }]}
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {PHOTOS.map((p) => (
            <figure key={p.src} className="mb-5 break-inside-avoid">
              <Image src={p.src} alt={p.caption} width={900} height={700} sizes="(max-width: 640px) 100vw, 33vw" className="h-auto w-full rounded-lg" />
              <figcaption className="pt-2 text-sm text-muted">{p.caption}</figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-12 border-t border-line pt-10">
          <h2 className="font-display text-3xl text-emerald">More on Instagram</h2>
          <p className="mt-2 text-sm text-muted">Follow @{site.instagramHandle} for our latest events.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a href={site.instagram} target="_blank" rel="noopener" className="inline-flex items-center justify-center rounded-full border border-emerald px-6 py-3 text-sm font-semibold text-emerald hover:bg-emerald hover:text-ivory">
              Open Instagram
            </a>
            <WhatsAppButton location="gallery" />
          </div>
        </div>
      </section>
    </>
  );
}
