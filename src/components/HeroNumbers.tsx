"use client";

import { formatPhone, whatsappLink } from "@/lib/data";
import { track } from "@/lib/analytics";

const MESSAGE = "Hi Milan Group, I would like to enquire about an event.";

// Same WhatsApp mark the flyer prints next to each number.
function WhatsAppMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z" />
    </svg>
  );
}

// The flyer's two numbers. Each opens a WhatsApp chat, so the hero needs no separate buttons.
export function HeroNumbers({ phones }: { phones: string[] }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-6">
      {phones.map((phone, i) => (
        <span key={phone} className="flex items-center gap-6">
          {i > 0 && <span aria-hidden="true" className="hidden h-7 w-px bg-gold sm:block" />}
          <a
            href={whatsappLink(MESSAGE, `91${phone}`)}
            target="_blank"
            rel="noopener"
            onClick={() => track("whatsapp_click", { location: "hero" })}
            aria-label={`WhatsApp ${formatPhone(phone)}`}
            className="inline-flex min-h-11 items-center gap-2 text-xl font-semibold tracking-wide text-ink transition-colors hover:text-emerald sm:text-2xl"
          >
            <span className="text-emerald">
              <WhatsAppMark />
            </span>
            {formatPhone(phone)}
          </a>
        </span>
      ))}
    </div>
  );
}
