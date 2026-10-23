import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildDesignsMessage, colourLine, groupDesigns, type DesignLike } from "../src/lib/designs.ts";

const products: DesignLike[] = JSON.parse(readFileSync("src/data/products.json", "utf8"));
const bySlug = (slug: string) => {
  const p = products.find((x) => x.slug === slug);
  if (!p) throw new Error(`missing product ${slug}`);
  return p;
};
const ornate = bySlug("ornate-chair");
const regalFlora = bySlug("regal-flora-chair");
const heritage = bySlug("milan-heritage-sofa");

test("groups furniture designs in label order and skips other categories", () => {
  const g = groupDesigns(products, ["chairs", "sofas"]);
  assert.deepEqual(g.map((x) => x.group), ["designer-chairs", "clear-chairs", "wooden-chairs", "sofas"]);
  assert.deepEqual(g.map((x) => x.items.length), [8, 5, 2, 5]);
  assert.equal(g[0].label, "Designer & banquet chairs");
});

test("tents page gets one Tents group of 5", () => {
  const g = groupDesigns(products, ["tents"]);
  assert.deepEqual(g.map((x) => [x.group, x.items.length]), [["tents", 5]]);
});

test("colourLine lists colours only when there is a choice", () => {
  assert.equal(colourLine(ornate), "5 colours: Gold, Brown, Black, White, Acrylic (Clear)");
  assert.equal(colourLine(regalFlora), null);
});

test("message with selection lists names and model names", () => {
  assert.equal(
    buildDesignsMessage("Furniture & Seating", [ornate, heritage]),
    "Hi Milan Group, I liked these: Ornate Chair, Premium Ivory Velvet Sofa – Heritage (MILAN HERITAGE).\nDate: \nVenue: \nGuests: ",
  );
});

test("message with nothing selected falls back to the service", () => {
  assert.equal(
    buildDesignsMessage("Tents & Roofing", []),
    "Hi Milan Group, I'd like to enquire about Tents & Roofing.\nDate: \nVenue: \nGuests: ",
  );
});
