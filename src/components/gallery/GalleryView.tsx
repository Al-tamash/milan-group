"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Maximize2, Sparkles } from "lucide-react";
import type { Service } from "@/lib/data";
import { filterGallery, type GalleryItem } from "@/lib/gallery";
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

  const tabs = useMemo(() => {
    return [{ slug: "all", name: "All Set-ups" }, ...services];
  }, [services]);

  const filteredItems = useMemo(() => {
    return filterGallery(items, activeTab);
  }, [items, activeTab]);

  return (
    <div>
      {/* Sticky Single-Row Services Filter Rail (No multi-line gaps, no redundant numbers) */}
      <div className="sticky top-[68px] sm:top-[92px] z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 bg-ivory/95 backdrop-blur-md pt-2 pb-3 mb-8 border-b border-line/60">
        <div
          role="tablist"
          aria-label="Gallery service filters"
          className="review-rail flex gap-2.5 overflow-x-auto pb-1 scroll-smooth"
        >
          {tabs.map((tab) => {
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
                className={`inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 py-2 text-xs sm:text-sm font-medium transition-all focus-visible:outline-gold ${
                  isActive
                    ? "border-emerald bg-emerald text-ivory shadow-sm"
                    : "border-line bg-white text-ink hover:border-gold hover:text-emerald"
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Masonry Grid — 100% Pure Clean Photography (No text overlays) */}
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
                {/* Pure Photo Presentation */}
                <div className="relative overflow-hidden bg-champagne/20">
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    width={900}
                    height={700}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Clean Hover Cue — Subtle zoom icon only (No text overlay) */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ivory/95 text-emerald shadow-lg transition-transform duration-200 group-hover:scale-110">
                      <Maximize2 className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal (Carries caption, service link & WhatsApp enquiry) */}
      <GalleryLightbox
        photos={filteredItems}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}
