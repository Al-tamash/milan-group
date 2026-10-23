import type { Metadata } from "next";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { site } from "@/lib/data";
import { CallButton, ContactPill, WhatsAppButton } from "@/components/ContactButtons";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Call or WhatsApp Milan Group, ${site.address.line1}, ${site.address.line2}. ${site.hours}.`,
  alternates: { canonical: "/contact/" },
};

// Same Date / Venue / Guests shape as the design picker's message, so every enquiry arrives ready to quote.
const QUOTE_MESSAGE = "Hi Milan Group, I'd like a quote.\nDate: \nVenue: \nGuests: \nWhat I need: ";

// From the booking steps and the price FAQ: what lets us reply with availability and a rate in one go.
const SEND_US = [
  { title: "Date of the function", text: "And the time, if it's an evening event." },
  { title: "Venue or area", text: "A Google Maps pin helps us plan the set-up." },
  { title: "Number of guests", text: "A rough count is fine." },
  { title: "What you need", text: "A list, or photos of set-ups you liked." },
];

// Contacts as on the business card, grouped so the first people to call are obvious.
const contact = (name: string) => site.contacts.find((c) => c.name === name)!;
const GROUPS = [
  { title: "Bookings and enquiries", people: [contact("Milan Group"), contact("Asiya Madam")] },
  { title: "Wedding flower work", people: [contact("Arif")] },
  { title: "Also at the office", people: [contact("Fasi"), contact("Fazal")], compact: true },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero: the main action first, with what to put in the message beside it */}
      <section className="border-b border-line bg-champagne/45">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
          <div>
            <nav aria-label="Breadcrumb" className="text-[0.8125rem] text-muted">
              <Link href="/" className="hover:text-emerald">Home</Link>
              <span className="mx-2 text-gold">/</span>
              <span aria-current="page">Contact</span>
            </nav>
            <h1 className="font-display mt-5 text-balance text-[2.6rem] leading-[1.05] text-emerald sm:text-5xl xl:text-[3.5rem]">Call or WhatsApp us</h1>
            <p className="mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-ink/80 sm:text-lg">
              We&rsquo;re open daily from 8 am to 10 pm. Send us the details and we&rsquo;ll reply with availability and
              a rate.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton location="contact-hero" message={QUOTE_MESSAGE} />
              <CallButton location="contact-hero" />
            </div>
          </div>

          <div className="rounded-xl border border-line bg-white p-6 sm:p-7">
            <h2 className="font-display text-2xl text-emerald sm:text-3xl">What to send us</h2>
            <ol className="mt-5 space-y-4">
              {SEND_US.map((item, i) => (
                <li key={item.title} className="grid grid-cols-[2rem_1fr] gap-x-3">
                  <span className="font-display flex h-8 w-8 items-center justify-center rounded-full border border-gold text-base text-emerald">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">
                    <span className="block font-semibold text-ink">{item.title}</span>
                    <span className="block text-sm leading-relaxed text-muted">{item.text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-5 border-t border-line pt-4 text-sm text-muted">
              The WhatsApp button above opens a message with these lines ready to fill in.
            </p>
          </div>
        </div>
      </section>

      {/* People + visit */}
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <section aria-labelledby="people">
          <h2 id="people" className="font-display text-4xl text-emerald sm:text-5xl">Talk to someone directly</h2>
          <div className="mt-8 space-y-8">
            {GROUPS.map((g) => (
              <div key={g.title}>
                <h3 className="border-b border-line pb-2 text-sm font-semibold text-gold-700">{g.title}</h3>
                <ul className="divide-y divide-line">
                  {g.people.map((c) => (
                    <li key={c.name} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-4">
                      <div className="flex items-center gap-3">
                        {!g.compact && (
                          <span aria-hidden className="font-display flex h-11 w-11 items-center justify-center rounded-full border border-gold text-lg text-emerald">
                            {c.name.charAt(0)}
                          </span>
                        )}
                        <span className={g.compact ? "text-base font-semibold text-ink" : "text-lg font-semibold text-ink"}>{c.name}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {c.phones.map((p, i) => (
                          <ContactPill
                            key={p}
                            kind="call"
                            phone={p}
                            name={c.name}
                            label={i === 0 ? "Call" : "Call 2nd number"}
                            location={`contact-${c.name.toLowerCase().split(" ")[0]}`}
                          />
                        ))}
                        <ContactPill
                          kind="whatsapp"
                          phone={c.phones[0]}
                          name={c.name}
                          label="WhatsApp"
                          location={`contact-${c.name.toLowerCase().split(" ")[0]}`}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="visit" className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="visit" className="font-display text-4xl text-emerald sm:text-5xl">Visit the office</h2>
          <div className="mt-8 overflow-hidden rounded-xl border border-line bg-white">
            <iframe
              title="Milan Group on Google Maps"
              src={site.mapEmbed}
              className="block h-64 w-full sm:h-80"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            <div className="space-y-3 p-5 text-[0.9375rem] sm:p-6">
              <p className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" />
                <span>{site.address.line1},<br />{site.address.line2}</span>
              </p>
              <p className="flex gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" />
                <span>
                  {site.hours}
                  <span className="block text-muted">{site.emergency}</span>
                </span>
              </p>
            </div>
          </div>
          {/* 360° Street View tour: hidden until the customer's tour is published and the link is in site.json */}
          {site.tour360 && (
            <div className="mt-10">
              <h2 className="font-display text-3xl text-emerald sm:text-4xl">Take a look around</h2>
              <div className="mt-5 overflow-hidden rounded-xl border border-line bg-white">
                <iframe
                  title="360° view of Milan Group"
                  src={site.tour360}
                  className="block h-64 w-full sm:h-80"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
