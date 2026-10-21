import type { Metadata } from "next";
import { site } from "@/lib/data";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Milan Group's website handles your information." };

// D32: short disclosure covering GA4 and the WhatsApp enquiry flow.
export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy policy" crumbs={[{ href: "/", label: "Home" }, { href: "/privacy/", label: "Privacy" }]} />
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-14 leading-relaxed text-muted sm:px-6">
        <p>Last updated: 21 October 2026.</p>
        <div>
          <h2 className="font-display text-3xl text-emerald">Enquiries</h2>
          <p className="mt-2">
            This website does not store anything you pick or type. When you press a WhatsApp button, a message is prepared on
            your own device, and it reaches {site.name} only if you choose to send it.
          </p>
        </div>
        <div>
          <h2 className="font-display text-3xl text-emerald">Analytics</h2>
          <p className="mt-2">
            We use Google Analytics to understand how visitors use this site — for example, which pages are viewed and how
            often the WhatsApp and call buttons are pressed. Google Analytics uses cookies and collects information such as
            your approximate location, device and browser.
            You can opt out using Google&rsquo;s browser add-on at tools.google.com/dlpage/gaoptout.
          </p>
        </div>
        <div>
          <h2 className="font-display text-3xl text-emerald">Contact</h2>
          <p className="mt-2">
            For any question about your information, contact {site.name}, {site.address.line1}, {site.address.line2}, or
            call +91 {site.contacts[0].phones[0]}.
          </p>
        </div>
      </section>
    </>
  );
}
