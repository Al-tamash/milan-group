"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import occasions from "@/data/occasions.json";
import { whatsappLink } from "@/lib/data";
import { track } from "@/lib/analytics";

// Each occasion opens WhatsApp with the occasion already written, so the chat starts with context.
export function OccasionTiles() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
      {occasions.map((o) => (
        <li key={o.slug}>
          <a
            href={whatsappLink(`${o.message}\nDate: \nVenue: \nGuests: `)}
            target="_blank"
            rel="noopener"
            onClick={() => track("whatsapp_click", { location: `occasion-${o.slug}` })}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white hover:border-gold"
          >
            <span className="relative block aspect-[4/3] bg-champagne">
              <Image src={`/images/${o.image}.webp`} alt="" fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover" />
            </span>
            <span className="flex flex-1 flex-col p-3 sm:p-4">
              <span className="font-display text-xl leading-tight text-emerald sm:text-2xl">{o.name}</span>
              <span className="mt-1 text-[0.8125rem] leading-relaxed text-muted sm:text-sm">Usually: {o.includes}</span>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[0.8125rem] font-semibold text-whatsapp sm:text-sm">
                <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
