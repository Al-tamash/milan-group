import { test } from "node:test";
import assert from "node:assert/strict";
import { filterGallery, getServiceCounts, buildGalleryWhatsAppMessage, type GalleryItem } from "../src/lib/gallery.ts";

const sampleItems: GalleryItem[] = [
  { id: "1", src: "/images/home/tents.webp", caption: "Garden tent setup", service: "tents-and-roofing" },
  { id: "2", src: "/images/home/stage.webp", caption: "Floral wedding stage", service: "wedding-flower-work" },
  { id: "3", src: "/images/home/tables.webp", caption: "Round banquet tables", service: "furniture-and-seating" },
];

test("filterGallery returns all items when serviceSlug is 'all'", () => {
  assert.equal(filterGallery(sampleItems, "all").length, 3);
});

test("filterGallery filters by specific service slug", () => {
  const tents = filterGallery(sampleItems, "tents-and-roofing");
  assert.equal(tents.length, 1);
  assert.equal(tents[0].id, "1");
});

test("getServiceCounts returns total and per-service counts", () => {
  const services = [
    { slug: "tents-and-roofing", name: "Tents & Roofing" },
    { slug: "wedding-flower-work", name: "Wedding & Flower Work" },
    { slug: "furniture-and-seating", name: "Furniture & Seating" },
    { slug: "sound-and-dj", name: "Sound & DJ" },
  ];
  const counts = getServiceCounts(sampleItems, services);
  assert.equal(counts["all"], 3);
  assert.equal(counts["tents-and-roofing"], 1);
  assert.equal(counts["sound-and-dj"], 0);
});

test("buildGalleryWhatsAppMessage generates expected enquiry text", () => {
  const msg = buildGalleryWhatsAppMessage("Floral wedding stage", "Wedding & Flower Work");
  assert.equal(
    msg,
    "Hi Milan Group, I saw this setup in your gallery and would like to enquire about it: Floral wedding stage (Wedding & Flower Work).\nDate: \nVenue: ",
  );
});
