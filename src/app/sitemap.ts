import type { MetadataRoute } from "next";
import { categories, productHref, products, services, site } from "@/lib/data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/", "/services/", "/catalog/", "/gallery/", "/about/", "/contact/", "/privacy/",
    ...services.map((s) => `/services/${s.slug}/`),
    ...categories.map((c) => `/catalog/${c.slug}/`),
    ...products.map(productHref),
  ];
  return paths.map((p) => ({ url: `${site.url}${p}` }));
}
