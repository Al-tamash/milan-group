export type GalleryItem = {
  id: string;
  src: string;
  caption: string;
  service: string;
  /** Gallery tab within a split service (see GALLERY_SPLITS) */
  category?: string;
  alt?: string;
};

export type GalleryTab = { slug: string; name: string };

/** Services shown as more than one gallery tab. Items in these services carry a matching `category`. */
export const GALLERY_SPLITS: Record<string, GalleryTab[]> = {
  "furniture-and-seating": [
    { slug: "sofas", name: "Sofas" },
    { slug: "chairs-and-tables", name: "Chairs & Tables" },
  ],
};

/** "All Set-ups" first, then one tab per service, with split services replaced by their split tabs in place. */
export function galleryTabs(services: { slug: string; name: string }[]): GalleryTab[] {
  return [
    { slug: "all", name: "All Set-ups" },
    ...services.flatMap((s) => GALLERY_SPLITS[s.slug] ?? [{ slug: s.slug, name: s.name }]),
  ];
}

/**
 * Filter gallery items by tab: an item's `category` if it has one, otherwise its service slug.
 * "all" returns all items.
 */
export function filterGallery(items: GalleryItem[], tab: string): GalleryItem[] {
  if (tab === "all") return items;
  return items.filter((item) => (item.category ?? item.service) === tab);
}

/**
 * Build pre-filled WhatsApp message for inquiring about a specific setup in the gallery.
 */
export function buildGalleryWhatsAppMessage(photoCaption: string, serviceName?: string): string {
  const serviceSuffix = serviceName ? ` (${serviceName})` : "";
  return `Hi Milan Group, I saw this setup in your gallery and would like to enquire about it: ${photoCaption}${serviceSuffix}.\nDate: \nVenue: `;
}
