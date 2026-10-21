import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";

export const metadata: Metadata = {
  title: "Your Enquiry",
  description: "Send your event enquiry to Milan Group on WhatsApp.",
  robots: { index: false },
};

export default function EnquiryPage() {
  return (
    <>
      <PageHero
        eyebrow="Enquiry"
        title="Get a quote"
        intro="Review your items, add your event details, and send everything to us in one WhatsApp message. We'll reply with availability and a quote."
        crumbs={[{ href: "/", label: "Home" }, { href: "/enquiry/", label: "Enquiry" }]}
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <EnquiryForm />
      </section>
    </>
  );
}
