import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { formatPhone, services, site } from "@/lib/data";

export function Footer() {
  return (
    <footer className="bg-forest text-ivory/85">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed">
            {site.promise} for weddings, receptions and every celebration in Hyderabad.
          </p>
          <p className="font-display mt-4 text-2xl text-gold">{site.motto}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gold">Services</h2>
          <ul className="mt-3 text-sm [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}/`} className="hover:text-gold">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gold">Designs & more</h2>
          <ul className="mt-3 text-sm [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center">
            <li><Link href="/services/furniture-and-seating/#designs" className="hover:text-gold">Chairs & sofas</Link></li>
            <li><Link href="/services/tents-and-roofing/#designs" className="hover:text-gold">Tents</Link></li>
            <li><Link href="/gallery/" className="hover:text-gold">Gallery</Link></li>
            <li><Link href="/about/" className="hover:text-gold">About us</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gold">Contact</h2>
          <ul className="mt-3 space-y-1 text-sm [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{site.address.line1},<br />{site.address.line2}</span>
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {site.hours}
            </li>
            {site.contacts.filter((c) => c.primary).map((c) => (
              <li key={c.name} className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={`tel:+91${c.phones[0]}`} className="hover:text-gold">
                  {c.name}: {formatPhone(c.phones[0])}
                </a>
              </li>
            ))}
            <li>
              <a href={site.instagram} target="_blank" rel="noopener" className="break-all hover:text-gold">
                Instagram: @{site.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-ivory/60 sm:flex-row sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <Link href="/privacy/" className="inline-flex min-h-11 items-center hover:text-gold">Privacy policy</Link>
        </div>
      </div>
    </footer>
  );
}
