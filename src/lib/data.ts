import productsJson from "@/data/products.json";
import servicesJson from "@/data/services.json";
import siteJson from "@/data/site.json";

export type Variant = { name: string; swatch: string; images: string[] };
export type Feature = { title: string; text: string };
export type Dimension = { label: string; value: string };

export type CategorySlug = "chairs" | "sofas" | "tents";

export type Product = {
  slug: string;
  category: CategorySlug;
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

export type Service = {
  slug: string;
  name: string;
  icon: string;
  heroTitle: string;
  promise: string;
  summary: string;
  description: string;
  image: string | null;
  /** true = temporary stock photo (D10), swap for the customer's own photo */
  imagePlaceholder: boolean;
  imageCredit?: string;
  contactName?: string;
  items: ServiceItem[];
  perfectFor: string[];
  faqs: Faq[];
  related: string[];
  catalog: CategorySlug[];
};

export const products = productsJson as Product[];
export const services = servicesJson as Service[];
export const site = siteJson;

export const categories: { slug: CategorySlug; name: string; blurb: string }[] = [
  { slug: "chairs", name: "Chairs", blurb: "Designer banquet, Chiavari, acrylic and wooden chairs in many colours." },
  { slug: "sofas", name: "Sofas", blurb: "Stage and lounge sofas in velvet, from classic carved to modern tufted." },
  { slug: "tents", name: "Tents", blurb: "Pagodas and German hanger tents — waterproof and fire-retardant." },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getProduct = (category: string, slug: string) =>
  products.find((p) => p.category === category && p.slug === slug);
export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const productsIn = (category: CategorySlug) => products.filter((p) => p.category === category);

export const productImage = (name: string) => `/images/products/${name}.webp`;
export const productHref = (p: Pick<Product, "category" | "slug">) => `/catalog/${p.category}/${p.slug}/`;

export const formatPhone = (n: string) => `${n.slice(0, 5)} ${n.slice(5)}`;

export function whatsappLink(text: string, number = site.enquiryWhatsApp) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
