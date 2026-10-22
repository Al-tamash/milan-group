"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, X } from "lucide-react";
import { getService, whatsappLink } from "@/lib/data";
import { buildGalleryWhatsAppMessage, type GalleryItem } from "@/lib/gallery";

export function GalleryLightbox({
  photos,
  activeIndex,
  onClose,
  onNavigate,
}: {
  photos: GalleryItem[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  const isOpen = activeIndex !== null && activeIndex >= 0 && activeIndex < photos.length;
  const photo = isOpen ? photos[activeIndex] : null;
  const service = photo ? getService(photo.service) : null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;

    if (isOpen) {
      if (!d.open) {
        try {
          d.showModal();
        } catch {
          // ignore if already open in concurrent renders
        }
      }
    } else if (d.open) {
      d.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onNavigate((activeIndex! - 1 + photos.length) % photos.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNavigate((activeIndex! + 1) % photos.length);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, photos.length, onNavigate, onClose]);

  if (!isOpen || !photo) return null;

  const prevIndex = (activeIndex - 1 + photos.length) % photos.length;
  const nextIndex = (activeIndex + 1) % photos.length;
  const enquiryMessage = buildGalleryWhatsAppMessage(photo.caption, service?.name);
  const waUrl = whatsappLink(enquiryMessage);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={`${photo.caption} photo viewer`}
      className="m-auto w-[min(64rem,calc(100vw-1.5rem))] max-h-[96vh] rounded-2xl bg-ivory p-0 text-ink shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col max-h-[96vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-line/80 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-champagne/70 px-3 py-1 text-xs font-semibold text-emerald">
              {activeIndex + 1} of {photos.length}
            </span>
            {service && (
              <Link
                href={`/services/${service.slug}/`}
                onClick={onClose}
                className="hidden text-xs font-semibold text-emerald hover:text-gold-700 sm:inline-block"
              >
                {service.name} →
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink/80 transition-colors hover:bg-champagne/60 hover:text-ink focus-visible:outline-gold"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Center Media Area with Navigation Chevrons */}
        <div className="relative flex flex-1 items-center justify-center bg-[#171e1a] p-2 sm:p-6 min-h-[320px] max-h-[65vh] overflow-hidden">
          <div className="relative h-full w-full max-h-[60vh] flex items-center justify-center">
            <Image
              src={photo.src}
              alt={photo.caption}
              width={1400}
              height={1000}
              priority
              sizes="(max-width: 768px) 96vw, 80vw"
              className="max-h-[60vh] w-auto max-w-full rounded-lg object-contain"
            />
          </div>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => onNavigate(prevIndex)}
                aria-label="Previous photo"
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-emerald hover:scale-105 focus-visible:outline-gold"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate(nextIndex)}
                aria-label="Next photo"
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-emerald hover:scale-105 focus-visible:outline-gold"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Bottom Details & Action */}
        <div className="border-t border-line/80 bg-ivory px-4 py-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-display text-xl text-emerald sm:text-2xl leading-snug">
                {photo.caption}
              </h3>
              {service && (
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-muted font-medium">Service:</span>
                  <Link
                    href={`/services/${service.slug}/`}
                    onClick={onClose}
                    className="text-xs font-semibold text-gold-700 hover:underline"
                  >
                    {service.name}
                  </Link>
                </div>
              )}
            </div>

            {/* Strict WhatsApp Enquiry CTA Only */}
            <div className="shrink-0">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#126e34] hover:shadow-lg focus-visible:outline-gold"
              >
                <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
