import productsJson from "@/data/products.json";
import servicesJson from "@/data/services.json";
import siteJson from "@/data/site.json";
import type { DesignGroup } from "./designs";

export type Variant = { name: string; swatch: string; images: string[] };
export type Feature = { title: string; text: string };
export type Dimension = { label: string; value: string };

export type CategorySlug = "chairs" | "sofas" | "tents";

export type Product = {
  slug: string;
  category: CategorySlug;
  group: DesignGroup;
  name: string;
  tagline: string;
  description: string;
  modelName?: string;
  featured: boolean;
  variants: Variant[];
  seatOptions: string[];
  seatNote?: string;
  features: Feature[];
  dimensions: Dimension[];
  suitedFor: string[];
};

export type ServiceItem = {
  name: string;
  text: string;
  /** path under /images without extension */
  image: string;
  href?: string;
  /** true = stock photo (D36), replace with the customer's own photo */
  stock?: boolean;
};

export type Faq = { q: string; a: string };

export type HeroPhoto = { src: string; alt: string; label?: string };

export type Service = {
  slug: string;
  name: string;
  icon: string;
  heroTitle: string;
  promise: string;
  summary: string;
  description: string;
  image: string | null;
  /** Real Milan set-up photo for the hero, used instead of the stock `image` where we have one */
  heroImage?: HeroPhoto;
  /** Optional second real photo shown beside the hero image (cropped from the bottom, so catalog titles fall away) */
  heroInset?: HeroPhoto;
  /** true = temporary stock photo (D10), swap for the customer's own photo */
  imagePlaceholder: boolean;
  imageCredit?: string;
  contactName?: string;
  items: ServiceItem[];
  perfectFor: string[];
  faqs: Faq[];
  related: string[];
  catalog: CategorySlug[];
  designsHeading?: string;
};

export const products = productsJson as Product[];
export const services = servicesJson as Service[];
export const site = siteJson;

export const getService = (slug: string) => services.find((s) => s.slug === slug);

export const productImage = (name: string) => `/images/products/${name}.webp`;

export const formatPhone = (n: string) => `${n.slice(0, 5)} ${n.slice(5)}`;

export function whatsappLink(text: string, number = site.enquiryWhatsApp) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
