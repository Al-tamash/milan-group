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
      {/* 10 Services Filter Rail */}
      <div className="mb-10">
        <div className="flex items-center justify-between pb-3 text-xs text-muted font-medium">
          <span>Filter by Service</span>
          <span>Showing {filteredItems.length} photos</span>
        </div>

        {/* Scrollable pill rail on mobile, wrapping pills on larger screens */}
        <div
          role="tablist"
          aria-label="Gallery service filters"
          className="review-rail flex gap-2 overflow-x-auto pb-3 sm:flex-wrap"
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
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs sm:text-sm font-medium transition-all focus-visible:outline-gold ${
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

      {/* Gallery Masonry Grid */}
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
                className="group relative mb-5 break-inside-avoid overflow-hidden rounded-xl border border-line bg-white shadow-xs transition-all hover:border-gold hover:shadow-md cursor-pointer"
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
                <div className="relative overflow-hidden bg-champagne/20">
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    width={900}
                    height={700}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  {/* Subtle hover icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory/95 text-emerald shadow-md">
                      <Maximize2 className="h-5 w-5" />
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 p-3.5">
                  <p className="font-medium text-sm text-ink group-hover:text-emerald transition-colors">
                    {photo.caption}
                  </p>
                  {service && (
                    <p className="text-xs text-gold-700 font-medium">
                      {service.name}
                    </p>
                  )}
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
