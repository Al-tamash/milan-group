"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Maximize2, Sparkles } from "lucide-react";
import type { Service } from "@/lib/data";
import { filterGallery, getServiceCounts, type GalleryItem } from "@/lib/gallery";
import { GalleryLightbox } from "./GalleryLightbox";

export function GalleryView({
  items,
  services,
}: {
  items: GalleryItem[];
  services: Service[];
}) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const counts = useMemo(() => getServiceCounts(items, services), [items, services]);

  const tabs = useMemo(() => {
    return [{ slug: "all", name: "All Set-ups" }, ...services];
  }, [services]);

  const filteredItems = useMemo(() => {
    return filterGallery(items, activeTab);
  }, [items, activeTab]);

  return (
    <div>
      {/* Sticky 10 Services Filter Rail */}
      <div className="sticky top-[68px] sm:top-[92px] z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 bg-ivory/95 backdrop-blur-md pt-2 pb-3 mb-8 border-b border-line/60">
        <div className="flex items-center justify-between pb-2.5 text-xs text-muted font-medium">
          <span className="font-semibold text-emerald">Browse by Service</span>
          <span>Showing {filteredItems.length} photos</span>
        </div>

        {/* Scrollable pill rail on mobile, wrapping pills on larger screens */}
        <div
          role="tablist"
          aria-label="Gallery service filters"
          className="review-rail flex gap-2 overflow-x-auto pb-1 sm:flex-wrap"
        >
          {tabs.map((tab) => {
            const count = counts[tab.slug] ?? 0;
            const isActive = activeTab === tab.slug;

            return (
              <button
                key={tab.slug}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveTab(tab.slug);
                  setLightboxIndex(null);
                }}
                className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all focus-visible:outline-gold ${
                  isActive
                    ? "border-emerald bg-emerald text-ivory shadow-sm"
                    : "border-line bg-white text-ink hover:border-gold hover:text-emerald"
                }`}
              >
                <span>{tab.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold transition-colors ${
                    isActive
                      ? "bg-gold text-forest"
                      : "bg-champagne/60 text-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Masonry Grid — Photo First Luxury Presentation */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-line bg-champagne/30 p-12 text-center">
          <p className="text-muted">No set-up photos available for this category yet.</p>
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-xs font-semibold text-ivory hover:bg-forest"
          >
            <Sparkles className="h-4 w-4" /> View All Set-ups
          </button>
        </div>
      ) : (
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {filteredItems.map((photo, index) => {
            const service = services.find((s) => s.slug === photo.service);

            return (
              <div
                key={photo.id || photo.src}
                className="group relative mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-line/70 bg-[#171e1a] shadow-xs transition-all duration-300 hover:border-gold hover:shadow-xl cursor-pointer"
                onClick={() => setLightboxIndex(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLightboxIndex(index);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`View ${photo.caption} in fullscreen`}
              >
                {/* Photo itself */}
                <div className="relative overflow-hidden bg-champagne/20">
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    width={900}
                    height={700}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Desktop Hover Gradient Overlay */}
                  <div className="absolute inset-0 hidden sm:flex flex-col justify-between p-4 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="self-end">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-md shadow-sm transition-transform duration-200 group-hover:scale-110">
                        <Maximize2 className="h-4 w-4" />
                      </span>
                    </div>
                    <div>
                      <p className="font-display text-lg text-white leading-snug drop-shadow-md">
                        {photo.caption}
                      </p>
                      {service && (
                        <p className="mt-1 text-xs font-semibold text-champagne drop-shadow-sm">
                          {service.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Mobile Discreet Floating Title Chip (No bulky white card) */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:hidden flex items-end justify-between gap-2 pointer-events-none">
                    <span className="inline-block max-w-[85%] truncate rounded-lg bg-black/65 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md shadow-sm">
                      {photo.caption}
                    </span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-md shadow-sm">
                      <Maximize2 className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <GalleryLightbox
        photos={filteredItems}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}
