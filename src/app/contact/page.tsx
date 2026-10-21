import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { site, whatsappLink } from "@/lib/data";
import { PageHero, RatingBadge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: `Call or WhatsApp Milan Group, ${site.address.line1}, ${site.address.line2}. ${site.hours}.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Call or WhatsApp us"
        intro="Any of these numbers works, day or night. For flowers, talk to Arif directly."
        crumbs={[{ href: "/", label: "Home" }, { href: "/contact/", label: "Contact" }]}
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <ul className="divide-y divide-line border-y border-line">
            {site.contacts.map((c) => (
              <li key={c.name} className="py-5">
                <p className="font-display text-2xl text-emerald">{c.name}</p>
                <p className="text-sm text-muted">{c.role}</p>
                {c.phones.map((p, i) => (
                  <div key={p} className="mt-3 flex flex-wrap gap-2">
                    <a href={`tel:+91${p}`} className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-emerald px-4 text-sm font-semibold text-emerald hover:bg-emerald hover:text-ivory">
                      <Phone className="h-3.5 w-3.5" /> {i === 0 ? "Call" : "Call other number"}
                    </a>
                    <a href={whatsappLink("Hi Milan Group, I would like to enquire about an event.", `91${p}`)} target="_blank" rel="noopener" aria-label={`WhatsApp ${c.name}`} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-whatsapp px-4 text-sm font-semibold text-white">
                      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                  </div>
                ))}
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-3 text-sm">
            <p className="flex gap-2"><MapPin className="h-5 w-5 shrink-0 text-gold-700" /> {site.address.line1}, {site.address.line2}</p>
            <p className="flex gap-2"><Clock className="h-5 w-5 shrink-0 text-gold-700" /> {site.hours}</p>
            <a href={site.mapUrl} target="_blank" rel="noopener" className="inline-block font-semibold text-emerald underline decoration-gold underline-offset-4">
              Get directions on Google Maps
            </a>
          </div>
          <div className="mt-6"><RatingBadge /></div>
        </div>
        <div className="overflow-hidden rounded-xl border border-line">
          <iframe title="Milan Group on Google Maps" src={site.mapEmbed} className="h-[28rem] w-full lg:h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>
    </>
  );
}
