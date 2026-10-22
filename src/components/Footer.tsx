import Link from "next/link";
import { Clock, Instagram, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { services, site } from "@/lib/data";

// Address parts never break mid-phrase ("Road No. 86" stays together); lines wrap only between parts.
const ADDRESS = `${site.address.line1}, ${site.address.line2}`.split(", ");

export function Footer() {
  return (
    <footer className="bg-forest text-ivory/85">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 xl:grid-cols-[1.1fr_2.2fr_0.9fr_1.4fr] xl:gap-10">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Tents, chairs, sound, lights and flowers for weddings and every other function in Hyderabad. Since {site.since}.
          </p>
          <p className="font-display mt-4 text-2xl text-gold">{site.motto}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gold">Services</h2>
          <ul className="mt-3 grid grid-cols-1 gap-x-6 text-sm min-[400px]:grid-cols-2 [&_a]:flex [&_a]:min-h-11 [&_a]:items-center [&_a]:py-1 [&_a]:leading-snug lg:[&_a]:min-h-9">
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
          <ul className="mt-3 text-sm [&_a]:flex [&_a]:min-h-11 [&_a]:items-center [&_a]:py-1 lg:[&_a]:min-h-9">
            <li><Link href="/services/furniture-and-seating/#designs" className="hover:text-gold">Chairs & sofas</Link></li>
            <li><Link href="/services/tents-and-roofing/#designs" className="hover:text-gold">Tents</Link></li>
            <li><Link href="/gallery/" className="hover:text-gold">Gallery</Link></li>
            <li><Link href="/about/" className="hover:text-gold">About us</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gold">Contact</h2>
          <ul className="mt-3 text-sm leading-6">
            <li className="flex gap-2.5 py-1">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" />
              <span>
                {ADDRESS.map((part, i) => (
                  <span key={part}>
                    <span className="whitespace-nowrap">{part}</span>
                    {i < ADDRESS.length - 1 && ", "}
                  </span>
                ))}
              </span>
            </li>
            <li className="flex gap-2.5 py-1">
              <Clock className="mt-1 h-4 w-4 shrink-0 text-gold" /> {site.hours}
            </li>
            {site.contacts.filter((c) => c.primary).map((c) => (
              <li key={c.name}>
                <a href={`tel:+91${c.phones[0]}`} className="flex min-h-11 items-center gap-2.5 hover:text-gold lg:min-h-9">
                  <Phone className="h-4 w-4 shrink-0 text-gold" /> Call {c.name}
                </a>
              </li>
            ))}
            <li>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener"
                title={`@${site.instagramHandle}`}
                className="flex min-h-11 items-center gap-2.5 hover:text-gold lg:min-h-9"
              >
                <Instagram className="h-4 w-4 shrink-0 text-gold" /> Follow us on Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 text-xs text-ivory/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="py-2">© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <Link href="/privacy/" className="inline-flex min-h-11 items-center hover:text-gold">Privacy policy</Link>
        </div>
      </div>
    </footer>
  );
}
