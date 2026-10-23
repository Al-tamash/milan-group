import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { filterGallery, galleryTabs, buildGalleryWhatsAppMessage, type GalleryItem } from "../src/lib/gallery.ts";

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

test("buildGalleryWhatsAppMessage generates expected enquiry text", () => {
  const msg = buildGalleryWhatsAppMessage("Floral wedding stage", "Wedding & Flower Work");
  assert.equal(
    msg,
    "Hi Milan Group, I saw this setup in your gallery and would like to enquire about it: Floral wedding stage (Wedding & Flower Work).\nDate: \nVenue: ",
  );
});

const split: GalleryItem[] = [
  { id: "s", src: "/a.webp", caption: "Sofa", service: "furniture-and-seating", category: "sofas" },
  { id: "c", src: "/b.webp", caption: "Chairs", service: "furniture-and-seating", category: "chairs-and-tables" },
  { id: "t", src: "/c.webp", caption: "Tent", service: "tents-and-roofing" },
];

test("galleryTabs replaces furniture-and-seating with its two splits", () => {
  const tabs = galleryTabs([
    { slug: "furniture-and-seating", name: "Furniture & Seating" },
    { slug: "tents-and-roofing", name: "Tents & Roofing" },
  ]);
  assert.deepEqual(tabs.map((t) => t.slug), ["all", "sofas", "chairs-and-tables", "tents-and-roofing"]);
  assert.deepEqual(tabs.map((t) => t.name), ["All Set-ups", "Sofas", "Chairs & Tables", "Tents & Roofing"]);
});

test("filterGallery matches category before service", () => {
  assert.deepEqual(filterGallery(split, "sofas").map((i) => i.id), ["s"]);
  assert.deepEqual(filterGallery(split, "tents-and-roofing").map((i) => i.id), ["t"]);
  assert.equal(filterGallery(split, "all").length, 3);
});

test("filterGallery keeps the service on split items", () => {
  assert.equal(filterGallery(split, "chairs-and-tables")[0].service, "furniture-and-seating");
});

test("every furniture photo in gallery.json has a split category", () => {
  const g = JSON.parse(readFileSync("src/data/gallery.json", "utf8")) as GalleryItem[];
  const furniture = g.filter((i) => i.service === "furniture-and-seating");
  assert.ok(furniture.length > 0);
  assert.ok(furniture.every((i) => i.category === "sofas" || i.category === "chairs-and-tables"));
});
