import type { MetadataRoute } from "next";
import { services, site } from "@/lib/data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/", "/services/", "/gallery/", "/about/", "/contact/", "/privacy/",
    ...services.map((s) => `/services/${s.slug}/`),
  ];
  return paths.map((p) => ({ url: `${site.url}${p}` }));
}
