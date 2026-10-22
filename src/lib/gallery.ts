export type GalleryItem = {
  id: string;
  src: string;
  caption: string;
  service: string;
  alt?: string;
};

/**
 * Filter gallery items by service slug.
 * "all" returns all items.
 */
export function filterGallery(items: GalleryItem[], serviceSlug: string): GalleryItem[] {
  if (serviceSlug === "all") return items;
  return items.filter((item) => item.service === serviceSlug);
}

/**
 * Calculate count of photos per service, plus the "all" total.
 */
export function getServiceCounts(
  items: GalleryItem[],
  services: { slug: string; name: string }[],
): Record<string, number> {
  const counts: Record<string, number> = {
    all: items.length,
  };

  for (const s of services) {
    counts[s.slug] = 0;
  }

  for (const item of items) {
    if (counts[item.service] !== undefined) {
      counts[item.service]++;
    }
  }

  return counts;
}

/**
 * Build pre-filled WhatsApp message for inquiring about a specific setup in the gallery.
 */
export function buildGalleryWhatsAppMessage(photoCaption: string, serviceName?: string): string {
  const serviceSuffix = serviceName ? ` (${serviceName})` : "";
  return `Hi Milan Group, I saw this setup in your gallery and would like to enquire about it: ${photoCaption}${serviceSuffix}.\nDate: \nVenue: `;
}
