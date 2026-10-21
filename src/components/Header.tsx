"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { site, whatsappLink } from "@/lib/data";
import { track } from "@/lib/analytics";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/services/", label: "Services" },
  { href: "/gallery/", label: "Gallery" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory/95 backdrop-blur">
      <div className="hidden bg-forest text-ivory sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-xs">
          <span className="tracking-wide">
            <span className="text-gold">{site.hours}</span> · {site.address.line2}
          </span>
          <a
            href={`tel:+91${site.contacts[0].phones[0]}`}
            onClick={() => track("call_click", { location: "topbar" })}
            className="flex items-center gap-1.5 hover:text-gold"
          >
            <Phone className="h-3.5 w-3.5" /> +91 {site.contacts[0].phones[0]}
          </a>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" aria-label="Milan Group home" className="flex min-h-11 items-center">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-emerald ${
                isActive(n.href) ? "text-emerald underline decoration-gold decoration-2 underline-offset-8" : "text-ink/80"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={whatsappLink("Hi Milan Group, I would like to enquire about an event.")}
            target="_blank"
            rel="noopener"
            onClick={() => track("whatsapp_click", { location: "header" })}
            className="hidden min-h-11 items-center gap-2 rounded-full bg-whatsapp px-5 text-sm font-semibold text-white hover:brightness-110 lg:inline-flex"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp us
          </a>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-md text-emerald lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-line bg-ivory px-4 pb-4 lg:hidden" aria-label="Mobile">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`block border-b border-line/70 py-3 text-base ${isActive(n.href) ? "font-semibold text-emerald" : "text-ink"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
