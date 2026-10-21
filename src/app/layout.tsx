import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/ContactButtons";
import { EnquiryProvider } from "@/components/enquiry/EnquiryContext";
import { site } from "@/lib/data";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
});
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Milan Group | Event Rentals & Supplying Company in Hyderabad",
    template: "%s | Milan Group Hyderabad",
  },
  description:
    "Milan Group, Jubilee Hills: tents, designer chairs, stage sofas, sound, lighting, Calcutta and wedding flower decoration. The complete set-up solution, 24 hours.",
  openGraph: { type: "website", siteName: site.name, locale: "en_IN", images: ["/images/home/stage.webp"] },
};

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  alternateName: "Milan Supplying Company",
  description: site.tagline,
  url: site.url,
  telephone: `+91${site.contacts[0].phones[0]}`,
  image: `${site.url}/images/home/stage.webp`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  hasMap: site.mapUrl,
  openingHours: "Mo-Su 00:00-23:59",
  sameAs: [site.instagram],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
        <EnquiryProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </EnquiryProvider>
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
