"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Check, Expand, MessageCircle } from "lucide-react";
import { productImage, products, whatsappLink, type CategorySlug, type Product } from "@/lib/data";
import { buildDesignsMessage, colourLine, groupDesigns } from "@/lib/designs";
import { track } from "@/lib/analytics";
import { DesignLightbox } from "./DesignLightbox";

type Props = {
  serviceSlug: string;
  serviceName: string;
  categories: CategorySlug[];
  heading: string;
  whatsappNumber?: string;
};

// Option B (spec 2026-10-21): designs grouped by type inside the service page; tap to pick, one WhatsApp message.
export function DesignsSection({ serviceSlug, serviceName, categories, heading, whatsappNumber }: Props) {
  const groups = groupDesigns(products, categories);
  const [picked, setPicked] = useState<string[]>([]);
  const [open, setOpen] = useState<Product | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const toggle = (slug: string) =>
    setPicked((p) => (p.includes(slug) ? p.filter((s) => s !== slug) : [...p, slug]));
  const selected = products.filter((p) => picked.includes(p.slug));
  const href = whatsappLink(buildDesignsMessage(serviceName, selected), whatsappNumber);

  return (
    <section id="designs" className="scroll-mt-28 border-t border-line bg-champagne/40">
      <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 sm:pt-16">
        <h2 className="font-display text-4xl text-emerald sm:text-5xl">{heading}</h2>
        <p className="mt-3 max-w-xl text-muted">
          Tap the ones you like, then send them to us on WhatsApp. We&rsquo;ll reply with availability and the rate.
        </p>

        {groups.map((g) => (
          <div key={g.group} className="mt-10">
            <h3 className="text-sm font-semibold text-ink">
              {g.label} <span className="font-normal text-muted">· {g.items.length}</span>
            </h3>
            {/* Short groups (tents) get bigger cards; long chair groups keep the dense grid. */}
            <ul className={`mt-4 grid gap-3 sm:gap-4 ${g.items.length <= 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"}`}>
              {g.items.map((p) => {
                const on = picked.includes(p.slug);
                const colours = colourLine(p);
                // Tent shots are on-site photos and fill the frame; chairs and sofas are cut-outs and stay whole.
                const photo = p.category === "tents";
                return (
                  <li key={p.slug} className="relative">
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(p.slug)}
                      className={`block w-full overflow-hidden rounded-xl border bg-white text-left transition-colors ${
                        on ? "border-emerald ring-2 ring-emerald" : "border-line hover:border-gold"
                      }`}
                    >
                      <span className={`relative block bg-[#f6f1e7] ${photo ? "aspect-[4/3]" : "aspect-square"}`}>
                        <Image
                          src={productImage(p.variants[0].images[0])}
                          alt=""
                          fill
                          sizes={photo ? "(max-width: 1024px) 50vw, 25vw" : "(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"}
                          className={photo ? "object-cover" : "object-contain p-2"}
                        />
                        {on && (
                          <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald text-ivory shadow-sm">
                            <Check className="h-4 w-4" strokeWidth={2.5} />
                          </span>
                        )}
                      </span>
                      <span className="block p-3">
                        <span className="block text-sm font-semibold leading-snug text-ink">{p.name}</span>
                        {colours && <span className="mt-0.5 block text-xs leading-snug text-muted">{colours}</span>}
                        <span className={`mt-1.5 block text-xs font-semibold ${on ? "text-emerald" : "text-gold-700"}`}>
                          {on ? "Added" : "Tap to add"}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label={`See photos of ${p.name}`}
                      onClick={(e) => {
                        opener.current = e.currentTarget;
                        setOpen(p);
                      }}
                      className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-full text-emerald hover:text-gold-700"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm">
                        <Expand className="h-4 w-4" />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Sticky on phones while the section is on screen; right padding keeps it clear of the floating WhatsApp button. */}
      <div className="sticky bottom-0 z-30 mt-10 border-t border-line bg-ivory/95 backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:backdrop-blur-none">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 pr-24 sm:px-6 sm:pb-14 sm:pt-0">
          <a
            href={href}
            target="_blank"
            rel="noopener"
            onClick={() => track("whatsapp_click", { location: `designs-${serviceSlug}`, selected: picked.length })}
            className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-whatsapp px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
          >
            <MessageCircle className="h-4 w-4" />
            {picked.length ? `Send ${picked.length} on WhatsApp` : "Send on WhatsApp"}
          </a>
          {picked.length > 0 && (
            <button type="button" onClick={() => setPicked([])} className="min-h-11 text-sm text-muted underline underline-offset-4 hover:text-ink">
              Clear
            </button>
          )}
        </div>
      </div>

      <DesignLightbox
        product={open}
        onClose={() => {
          setOpen(null);
          opener.current?.focus();
        }}
      />
    </section>
  );
}
