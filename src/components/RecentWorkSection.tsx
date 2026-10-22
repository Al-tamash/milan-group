"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gallery } from "@/lib/data";
import { GalleryLightbox } from "./gallery/GalleryLightbox";

type Props = {
  serviceSlug: string;
  serviceName: string;
  whatsappNumber?: string;
};

export function RecentWorkSection({ serviceSlug }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Get real photos for this service from gallery
  const photos = gallery.filter((item) => item.service === serviceSlug);

  if (photos.length === 0) return null;

  return (
    <section id="recent-work" className="scroll-mt-28 border-t border-line bg-champagne/30 py-16 sm:py-20">
      <span id="designs" className="sr-only" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl text-emerald sm:text-5xl">
              Recent setups & real events
            </h2>
            <p className="mt-3 text-base text-muted sm:text-lg">
              Photos from recent client setups across Shamshabad, Gachibowli, Kompally, and Jubilee Hills.
            </p>
          </div>
          <Link
            href="/gallery/"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-emerald hover:text-gold-700 transition-colors shrink-0"
          >
            View full gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 6-Photo Clean Grid (Simple clean images without text overlays) */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {photos.map((photo, index) => (
            <figure
              key={photo.id || photo.src}
              onClick={() => setLightboxIndex(index)}
              className="group relative aspect-[4/3] sm:aspect-[16/11] cursor-pointer overflow-hidden rounded-2xl border border-line bg-champagne/60 shadow-xs transition-all hover:border-gold hover:shadow-md"
            >
              <Image
                src={photo.src}
                alt={photo.caption}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </figure>
          ))}
        </div>

        {/* Footnote reassurance */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-line bg-white p-4 sm:px-6">
          <p className="text-sm text-muted">
            Need a similar setup for your event ground? Send us your ground dimensions and photos on WhatsApp.
          </p>
          <Link
            href="/contact/"
            className="inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald hover:text-gold-700 shrink-0"
          >
            Talk to our team <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Lightbox for full size photo viewer */}
      <GalleryLightbox
        photos={photos}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </section>
  );
}
