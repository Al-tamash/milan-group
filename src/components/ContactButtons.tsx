"use client";

import { MessageCircle, Phone } from "lucide-react";
import { site, whatsappLink } from "@/lib/data";
import { track } from "@/lib/analytics";

type Props = {
  message?: string;
  location: string;
  number?: string;
  callNumber?: string;
  tone?: "light" | "dark";
};

export function WhatsAppButton({ message = "Hi Milan Group, I would like to enquire about an event.", location, number }: Props) {
  return (
    <a
      href={whatsappLink(message, number)}
      target="_blank"
      rel="noopener"
      onClick={() => track("whatsapp_click", { location })}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
    >
      <MessageCircle className="h-4 w-4" /> WhatsApp us
    </a>
  );
}

export function CallButton({ location, callNumber = site.contacts[0].phones[0], tone = "light" }: Props) {
  return (
    <a
      href={`tel:+91${callNumber}`}
      onClick={() => track("call_click", { location })}
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors ${
        tone === "dark"
          ? "border-gold/70 text-ivory hover:bg-ivory/10"
          : "border-emerald text-emerald hover:bg-emerald hover:text-ivory"
      }`}
    >
      <Phone className="h-4 w-4" /> Call us
    </a>
  );
}

// Quiet text link for a single item, so a card gets one light action instead of another green button.
export function AskLink({ message, location, number }: { message: string; location: string; number?: string }) {
  return (
    <a
      href={whatsappLink(message, number)}
      target="_blank"
      rel="noopener"
      onClick={() => track("whatsapp_click", { location })}
      className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-emerald hover:text-gold-700"
    >
      <MessageCircle className="h-4 w-4" /> Ask about this
    </a>
  );
}

// Compact call / WhatsApp pill for a named person on the contact list.
export function ContactPill({ kind, phone, label, name, location }: { kind: "call" | "whatsapp"; phone: string; label: string; name: string; location: string }) {
  const call = kind === "call";
  return (
    <a
      href={call ? `tel:+91${phone}` : whatsappLink("Hi Milan Group, I would like to enquire about an event.", `91${phone}`)}
      target={call ? undefined : "_blank"}
      rel={call ? undefined : "noopener"}
      onClick={() => track(call ? "call_click" : "whatsapp_click", { location })}
      aria-label={`${label} ${name}`}
      className={`inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors ${
        call ? "border border-emerald text-emerald hover:bg-emerald hover:text-ivory" : "bg-whatsapp text-white hover:brightness-110"
      }`}
    >
      {call ? <Phone className="h-3.5 w-3.5" /> : <MessageCircle className="h-3.5 w-3.5" />} {label}
    </a>
  );
}

export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink("Hi Milan Group, I would like to enquire about an event.")}
      target="_blank"
      rel="noopener"
      onClick={() => track("whatsapp_click", { location: "floating" })}
      aria-label="Chat with Milan Group on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 lg:hidden items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-black/20 transition-transform hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
