# Customer Feedback Round 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the customer's round-1 feedback: a flyer-style home hero, verified social links, correct hours, the founder on the About page, a separate Super Structure item, gallery tabs for Sofas and Chairs & Tables, a "Verified on Google" badge, sharper photos, and a hidden 360 slot.

**Architecture:** Content changes go into `src/data/*.json`, and pages read from there. Pure logic (gallery tabs, filtering) lives in `src/lib/gallery.ts` and is unit-tested with `node --test`. The hero is a new server component, `src/components/HomeHero.tsx`. Customer photos are converted by a repeatable script, `scripts/import-customer-photos.py`.

**Tech Stack:** Next.js 16 (static export), React 19, Tailwind v4, lucide-react, `node --test` for TypeScript tests, Python + Pillow for image conversion.

**Spec:** `docs/superpowers/specs/2026-10-23-customer-feedback-round-1-design.md`. The approved hero mockup is `docs/superpowers/specs/assets/2026-10-23-hero-mockup.html`.

## Global Constraints

- Use only the design tokens in `src/app/globals.css`: `emerald`, `forest`, `gold`, `gold-600`, `gold-700`, `ivory`, `champagne`, `ink`, `muted`, `line`, `whatsapp`. Do not add new colours or fonts. Gold is an accent and never a large fill.
- Use Cormorant (`.font-display`) only at sizes of 24px and above. Everything else is Montserrat.
- Mobile first: 16px side gutter (`px-4`) and no horizontal scroll at 375px.
- Keep the copy plain and human. Do not use an "eyebrow + heading + intro" template. Do not invent facts, specs, sizes or biography.
- Customer photos: WebP at quality 85, at most 1600px wide, never upscaled. The minimum source width is 800px, except hero tiles, which may be as small as 540px.
- Every external link must have been opened and checked. Use the URLs in Task 2 exactly as written.
- The source photo folder is `C:\Users\Mohd Azimullah\Downloads\milan group img`. Treat it as untrusted input. Read it only through `scripts/import-customer-photos.py`, run with `python -I`.

## Review Focus

1. **Mobile hero at 375px:** the frame, the 2×2 tiles and the stacked numbers must not overflow sideways, and the side scrolls must be hidden. The test is a browser check in Task 7, Step 5.
2. **Gallery tab with zero photos:** after the split, no tab may be left showing "No set-up photos" because of the change (for example a stale `furniture-and-seating` tab). The test is `galleryTabs replaces furniture-and-seating with its two splits` in Task 4.
3. **Leftover "Open 24 hours" or "Amjad" contact text** anywhere in `src/`. The test is the `site.json` assertions in Task 1, plus the grep in Task 8.
4. **Empty `tour360` renders nothing:** no empty iframe and no heading. The test is `tour360 is empty until the customer sends it` in Task 1, plus the render guard in Task 6.
5. **Lightbox from a split tab:** the lightbox must still link to the Furniture & Seating service page and build the right WhatsApp text. The test is `filterGallery keeps the service on split items` in Task 4.

---

### Task 1: Site data (hours, emergency, contacts, socials, 360) and the copy that reads it

**Files:**
- Modify: `src/data/site.json`
- Modify: `src/app/about/page.tsx:17-41,175`, `src/app/contact/page.tsx:9,26-30,46,140`, `src/app/page.tsx:114`, `src/components/sections.tsx:81`, `src/components/Footer.tsx:56`, `src/app/layout.tsx:27,50`
- Test: `tests/site.test.ts` (new)

**Interfaces:**
- Produces: `site.hours = "Open daily, 8 am – 10 pm"`, `site.emergency = "Emergency service 24 hours"`, `site.tour360 = ""`, and `site.socials: { key: "instagram" | "facebook" | "youtube" | "x" | "whatsapp-channel"; label: string; url: string }[]`. `site.instagram` and `site.instagramHandle` are removed. Task 2 replaces their consumers.

- [ ] **Step 1: Write the failing test** in `tests/site.test.ts`. Read `src/data/site.json` with `readFileSync`, as `tests/designs.test.ts` does.

```ts
test("hours are daily 8 am – 10 pm, with 24 hours only for emergencies", () => {
  assert.equal(site.hours, "Open daily, 8 am – 10 pm");
  assert.equal(site.emergency, "Emergency service 24 hours");
  assert.ok(!JSON.stringify(site).includes("Open 24 hours"));
});
test("the founder is not listed as a contact", () => {
  assert.ok(!site.contacts.some((c) => /amjad/i.test(c.name)));
  assert.equal(site.contacts[0].name, "Milan Group");
  assert.equal(site.contacts[0].phones[0], "9441361086");
});
test("socials are the five verified accounts", () => {
  assert.deepEqual(site.socials.map((s) => s.url), [
    "https://www.instagram.com/milan_s_co_group/",
    "https://www.facebook.com/milansupplyingcompany1218",
    "https://www.youtube.com/@Milanscogroup",
    "https://x.com/CoSupplying",
    "https://whatsapp.com/channel/0029Va6JZStL2ATy7zUn2r14",
  ]);
  assert.equal(site.socials[4].label, "WhatsApp Channel");
});
test("tour360 is empty until the customer sends it", () => {
  assert.equal(site.tour360, "");
});
```

- [ ] **Step 2: Run** `npm test`. Expected: the 4 new tests FAIL.

- [ ] **Step 3: Edit `site.json`:**
  - Set `hours`, and add `emergency`, `tour360` and `socials` (labels: "Instagram", "Facebook", "YouTube", "X", "WhatsApp Channel").
  - Delete `instagram` and `instagramHandle`.
  - Set `contacts[0]` to `{ "name": "Milan Group", "role": "Bookings & enquiries", "phones": ["9441361086"], "primary": true }`.
  - In `stats`, change the item `"24 hrs"` to have the label `"Emergency service"`.

- [ ] **Step 4: Update the readers**:
  - **`about/page.tsx`:** change the third `COUNT_ON` card to `title: "Here when it matters"`, with text saying the office is open daily 8 am – 10 pm and that emergency service runs 24 hours. Do not suggest that new bookings are taken at night.
    - In `PEOPLE`, change the first entry to `name: site.contacts[0].name`.
    - Change line 175 to `{site.hours}`, dropping ", every day", and add a second line with `{site.emergency}`.
  - **`contact/page.tsx`:**
    - Change the `GROUPS` entry `contact("Amjad")` to `contact("Milan Group")`.
    - Rewrite the hero sentence on line 46 to "We're open daily from 8 am to 10 pm. Send us the details and we'll reply with availability and a rate." and remove the `.replace("open ", "")` hack.
    - Change line 140 the same way as About line 175.
    - The meta description stays `${site.hours}`.
  - **`page.tsx:114`:** change the line to `{site.hours}. Emergency service 24 hours. Ask for Asiya Madam.`
  - **`sections.tsx:81` `StatsLine`:** change it to `Since {site.since} · Jubilee Hills, Hyderabad · {site.hours}`.
  - **`Footer.tsx:56`:** below the hours line, add `{site.emergency}` as a second muted line. The "Call {c.name}" text now renders "Call Milan Group" automatically.
  - **`layout.tsx`:** in the meta description (line 27), replace "Open 24 hours." with "Open daily 8 am – 10 pm.", and set `openingHours: "Mo-Su 08:00-22:00"`.

- [ ] **Step 5: Run** `npm test`. Expected: all tests PASS. Then run `grep -rni "open 24\|amjad" src`. Expected: no matches.

- [ ] **Step 6: Commit** with the message `feat: daily hours, emergency line, Milan Group as main contact, verified socials data`.

### Task 2: Social links in the footer, gallery page and JSON-LD

**Files:**
- Create: `src/components/SocialLinks.tsx`
- Modify: `src/components/Footer.tsx:64-76`, `src/app/gallery/page.tsx:2,36-48`, `src/app/layout.tsx:51`

**Interfaces:**
- Consumes: `site.socials` (Task 1).
- Produces: `SocialLinks({ tone }: { tone?: "light" | "dark" }): JSX.Element`, a row of icon links.

- [ ] **Step 1: Create `SocialLinks`.** Write inline SVG icons for Instagram, Facebook, YouTube, X and WhatsApp (lucide has no brand icons).
  - Give each link `aria-label={label}`, `target="_blank"`, `rel="noopener"`, and a tap target of at least 44px.
  - Icons are `gold` on `dark` and `emerald` on `light`. The WhatsApp Channel shows its text label "WhatsApp Channel" next to the icon, so it cannot be mistaken for the enquiry button.

- [ ] **Step 2: Wire it in**:
  - **Footer:** replace the Instagram `<li>` with `<SocialLinks tone="dark" />`.
  - **Gallery page:**
    - Change the line to "Follow us on Instagram, Facebook and YouTube for recent function photos."
    - Replace the Instagram button with `<SocialLinks tone="light" />`, and keep the WhatsApp enquiry button where it is.
  - **Layout:** change to `sameAs: site.socials.map((s) => s.url)`.

- [ ] **Step 3: Run** `npm run build`. Expected: success with no type errors, and no `instagramHandle` left (`grep -rn instagram src` shows only `SocialLinks`).

- [ ] **Step 4: Commit** with the message `feat: footer and gallery social links (Instagram, Facebook, YouTube, X, WhatsApp Channel)`.

### Task 3: Founder line on About, and "Verified on Google" on the rating badge

**Files:**
- Modify: `src/app/about/page.tsx` (the story section), `src/components/ui.tsx:54-74`

- [ ] **Step 1: About page.** In the story section, add one plain line: "Founded in 1995 by Late Mr. Mohammad Amjad." Use `site.since` for the year. Style it like the surrounding story text, for example as a short line with a gold hairline above it. Do not add a portrait or biography.

- [ ] **Step 2: `RatingBadge`.** After the review count, add a `BadgeCheck` icon from lucide with the text "Verified on Google". Keep the same link (`site.mapUrl`), the same light and dark styles, and wrap cleanly at 375px.

- [ ] **Step 3: Run** `npm run build`. Expected: success.

- [ ] **Step 4: Commit** with the message `feat: founder line on About, Verified on Google badge`.

### Task 4: Gallery tabs, with Furniture & Seating split into Sofas and Chairs & Tables

**Files:**
- Modify: `src/lib/gallery.ts`, `src/components/gallery/GalleryView.tsx:20-26`, `src/data/gallery.json` (the 9 furniture items)
- Test: `tests/gallery.test.ts`

**Interfaces:**
- Produces:
  - `GalleryItem.category?: string`
  - `export type GalleryTab = { slug: string; name: string }`
  - `export const GALLERY_SPLITS: Record<string, GalleryTab[]>`, set to `{ "furniture-and-seating": [{ slug: "sofas", name: "Sofas" }, { slug: "chairs-and-tables", name: "Chairs & Tables" }] }`
  - `export function galleryTabs(services: { slug: string; name: string }[]): GalleryTab[]`: returns `"all"` ("All Set-ups") first, then each service, with any service in `GALLERY_SPLITS` replaced by its split tabs in place.
  - `filterGallery(items, tab)`: matches `item.category ?? item.service`.
  - `getServiceCounts`: counts by the same key. It may be deleted if nothing uses it. It is currently unused outside the tests, so delete it and its test.

- [ ] **Step 1: Write the failing tests** in `tests/gallery.test.ts`:

```ts
const split: GalleryItem[] = [
  { id: "s", src: "/a.webp", caption: "Sofa", service: "furniture-and-seating", category: "sofas" },
  { id: "c", src: "/b.webp", caption: "Chairs", service: "furniture-and-seating", category: "chairs-and-tables" },
  { id: "t", src: "/c.webp", caption: "Tent", service: "tents-and-roofing" },
];
test("galleryTabs replaces furniture-and-seating with its two splits", () => {
  const tabs = galleryTabs([{ slug: "furniture-and-seating", name: "Furniture & Seating" }, { slug: "tents-and-roofing", name: "Tents & Roofing" }]);
  assert.deepEqual(tabs.map((t) => t.slug), ["all", "sofas", "chairs-and-tables", "tents-and-roofing"]);
});
test("filterGallery matches category before service", () => {
  assert.deepEqual(filterGallery(split, "sofas").map((i) => i.id), ["s"]);
  assert.deepEqual(filterGallery(split, "tents-and-roofing").map((i) => i.id), ["t"]);
});
test("filterGallery keeps the service on split items", () => {
  assert.equal(filterGallery(split, "chairs-and-tables")[0].service, "furniture-and-seating");
});
test("every furniture photo in gallery.json has a split category", () => {
  const g = JSON.parse(readFileSync("src/data/gallery.json", "utf8")) as GalleryItem[];
  const furniture = g.filter((i) => i.service === "furniture-and-seating");
  assert.ok(furniture.every((i) => i.category === "sofas" || i.category === "chairs-and-tables"));
});
```

- [ ] **Step 2: Run** `npm test`. Expected: the new tests FAIL (`galleryTabs` is not exported).

- [ ] **Step 3: Implement** the Interfaces in `gallery.ts`, then set `category` on the 9 items in `gallery.json`:
  - **Sofas:** `furniture-royal-blue-sofa`, `furniture-milan-elegance-sofa`, `furniture-velvet-beige-sofa`, `furniture-emerald-sofa`, `furniture-milan-curve-sofa`
  - **Chairs & Tables:** `furniture-banquet-setup`, `furniture-acrylic-chairs`, `furniture-hall-seating`, `furniture-imperia-gold-chair`
  - In `GalleryView`, change to `const tabs = useMemo(() => galleryTabs(services), [services]);`.
  - Check `GalleryLightbox`: it must look up the service by `photo.service`, not by the active tab.

- [ ] **Step 4: Run** `npm test`. Expected: PASS.

- [ ] **Step 5: Commit** with the message `feat(gallery): separate Sofas and Chairs & Tables tabs`.

### Task 5: Import customer photos, add the Super Structure item, replace stock photos

**Files:**
- Create: `scripts/import-customer-photos.py`
- Create: WebP files under `public/images/` (listed below)
- Modify: `src/data/products.json` (append `super-structure`), `src/data/services.json` (tents `items`, item `stock` flags), `src/data/gallery.json` (new entries)
- Test: `tests/designs.test.ts`, or a new assertion in `tests/site.test.ts`

**Interfaces:**
- Produces the image paths that Task 7 uses: `public/images/home/hero-tents.webp`, `hero-tables.webp`, `hero-decor.webp` (3:4).

- [ ] **Step 1: Write the script.**
  - Usage: `python -I scripts/import-customer-photos.py "<source dir>"`.
  - It holds a `JOBS` list of `(source filename, output path under public/images, aspect "3:4" | "4:3" | "orig", focus (x, y) as 0–1 fractions, trim_bottom px)`.
  - For each job it crops to the aspect around the focus point, trims the bottom if asked (used for the watermark), caps the width at 1600, never upscales, and saves WebP at quality 85.
  - It refuses to write and prints a warning if the output is narrower than 800px. For `home/hero-*` outputs the limit is 540px instead.
  - Initial jobs (the builder tunes the focus points by looking at the output):

| Source (`WhatsApp Image 2026-10-22 at …`) | Output | Aspect |
|---|---|---|
| `10.01.55 PM.jpeg` | `home/hero-tents.webp` | 3:4 |
| `10.02.12 PM (1).jpeg` | `home/hero-tables.webp` | 3:4 |
| `9.56.57 PM (1).jpeg` | `home/hero-decor.webp` | 3:4 |
| `9.52.52 PM.jpeg` | `products/super-structure-1.webp` | orig |
| `9.56.56 PM.jpeg` | `products/super-structure-2.webp` | 4:3 |
| `9.56.57 PM.jpeg` | `products/super-structure-3.webp` | 4:3 |
| `9.53.26 PM.jpeg` (trim the "OnePlus 12 / Hasselblad" strip) | `items/t-gazebo.webp` | 4:3 |
| `10.02.12 PM.jpeg` | `items/t-pandal.webp` | 4:3 |
| `10.02.11 PM.jpeg` | `items/f-banquet-tables.webp` | 4:3 |
| `9.58.05 PM.jpeg` | `home/real-german-hanger.webp` | 4:3 |
| `10.01.52 PM.jpeg`, `10.01.54 PM.jpeg`, `10.02.11 PM (1).jpeg`, `10.02.13 PM (1).jpeg`, `10.02.13 PM.jpeg`, `9.56.55 PM.jpeg`, `9.56.56 PM (1).jpeg`, `9.58.06 PM.jpeg` | `home/real-<short-name>.webp` | 4:3 |

  - Skip `10.01.53 PM.jpeg` (368px), `9.56.58 PM.jpeg` (looks like stock) and `9.31.12 PM.jpeg` (the flyer).

- [ ] **Step 2: Run** the script and open a contact sheet of the outputs. Re-tune the focus points until each crop shows its subject. Expected: every job writes a file, except jobs that print a width warning. Drop those jobs rather than upscaling.

- [ ] **Step 3: Write the failing data test:**

```ts
test("super structure is its own tents product with real photos", () => {
  const p = products.find((x) => x.slug === "super-structure")!;
  assert.equal(p.category, "tents");
  assert.deepEqual(p.dimensions, []);
  assert.deepEqual(p.variants[0].images, ["super-structure-1", "super-structure-2", "super-structure-3"]);
});
test("tents service lists German hanger and Super structure separately", () => {
  const names = services.find((s) => s.slug === "tents-and-roofing")!.items.map((i) => i.name);
  assert.ok(names.includes("German hanger") && names.includes("Super structure"));
  assert.ok(!names.some((n) => /german hanger \(super structure\)/i.test(n)));
});
```

- [ ] **Step 4: Edit the data**:
  - **`products.json`:** append `super-structure`:
    - `category: "tents"`, `group: "tents"`, `name: "Super Structure"`
    - a one-line tagline and a plain description (steel frame structure for large covered events, with no numbers)
    - `featured: false`, `seatOptions: []`
    - `features: [{ "title": "Steel frame", … }, { "title": "Large covered span", … }]`
    - `dimensions: []`
    - `suitedFor: ["Weddings", "Receptions", "Large gatherings"]`
  - **`services.json` tents `items`:**
    - Rename the first row to "German hanger".
    - Insert a "Super structure" row after it, with `image: "products/super-structure-1"`.
    - Remove `stock: true` from `t-pandal` and `t-gazebo` (both are now real photos).
    - Remove `stock: true` from the furniture item that uses `f-banquet-tables`, if it is flagged.
  - **`gallery.json`:**
    - Add `tents-super-structure` (`products/super-structure-2`, service `tents-and-roofing`).
    - Add one entry per `home/real-*.webp`, each with an honest caption and the service it shows. Real chair set-ups get `service: "furniture-and-seating", category: "chairs-and-tables"`. Tent shots get `tents-and-roofing`. The gate and the red night décor go to `theme-functions` or `lighting-and-electrical`, depending on what is shown.

- [ ] **Step 5: Run** `npm test`. Expected: PASS.

- [ ] **Step 6: Replace the worst remaining stock photos.** **Ask the user before downloading anything.** The files are `items/l-moving`, `items/s-mic`, `services/sound-and-dj`, `items/s-dancefloor`, `items/j-hair`, `items/l-led`, `items/c-water`, `items/l-uplight`, `items/c-brass` and `items/k-cutflower`.
  - Find a free-licence photo of the same subject on Unsplash or Pexels, at least 1200px wide.
  - Download it into a new empty folder under the scratchpad, and convert it to WebP at quality 85, 1600px wide maximum, at the same path and the same aspect as the file it replaces.
  - Record the credit in `services.json` `imageCredit` where that field exists.
  - Keep `stock: true` on these items, because they are still stock photos.

- [ ] **Step 7: Commit** with the message `feat: customer photos, Super Structure item, sharper stock photos`. Include the script and the images.

### Task 6: Contact page 360 slot (renders nothing while empty)

**Files:**
- Modify: `src/app/contact/page.tsx` (next to the map iframe at about line 126)

- [ ] **Step 1:** Below the map, add `{site.tour360 && (<section>…<h2>Take a look around</h2><iframe src={site.tour360} title="360° view of Milan Group" loading="lazy" allowFullScreen className="h-80 w-full" />…</section>)}`, styled like the map block. With `tour360` empty, nothing renders.

- [ ] **Step 2: Run** `npm run build`, then `grep -c "Take a look around" out/contact/index.html`. Expected: `0`.

- [ ] **Step 3: Commit** with the message `feat(contact): hidden 360 tour slot`.

### Task 7: Flyer-style home hero

**Files:**
- Create: `src/components/HomeHero.tsx`
- Modify: `src/app/page.tsx:17-48` (replace the hero section and the `HERO` / `GALLERY` constants), `src/components/Logo.tsx` (add a single-ring variant)

**Interfaces:**
- Consumes: `site.contacts[0].phones[0]`, `site.contacts[1].phones[0]`, `site.motto`, `whatsappLink(message, number)` from `@/lib/data`, `track` from `@/lib/analytics`, the hero images from Task 5, and `RatingBadge` / `StatsLine`.
- Produces:
  - `HomeHero(): JSX.Element` (server component). The clickable numbers live in a small client child, `HeroNumbers`, in the same file or alongside it.
  - `LogoMark({ className, single }: { className?: string; single?: boolean })`. When `single` is set, it draws one emerald oval ring. The header keeps the default.

- [ ] **Step 1: Build `HomeHero`** to match the approved mockup `docs/superpowers/specs/assets/2026-10-23-hero-mockup.html`, top to bottom:
  1. Corner ribbons (SVG, `aria-hidden`, top-left and bottom-right).
  2. `<h1>` containing "MILAN", then "GROUP" between gold rules, then `LogoMark single`.
  3. The frame: corner SVGs, line spans, side scrolls hidden below `md`, "Event Rentals" in small caps, and the pill.
  4. "UNDER THE MILAN" on the bottom line.
  5. Numbers formatted with `formatPhone`, opening `whatsappLink("Hi Milan Group, I would like to enquire about an event.", "91" + phone)` and firing `track("whatsapp_click", { location: "hero" })`.
  6. Four arch tiles: `home/hero-tents`, `home/stage`, `home/hero-tables` and `home/hero-decor`, captioned Tents, Stage, Tables & Chairs, Decor & Lighting. Use `next/image` with `sizes="(max-width: 768px) 50vw, 210px"`, and set `preload` on the first.
  7. The service strip.
  8. `site.motto`.
  - Copy the corner and flourish SVG paths exactly from the mockup (`.frame .c` and `.flour`).
  - Convert the mockup's CSS to Tailwind classes and token colours. Inline `style` is acceptable only for SVG transforms.
  - There are no "WhatsApp us" / "Call us" buttons in the hero.

- [ ] **Step 2: In `page.tsx`**:
  - Render `<HomeHero />`.
  - Directly under it, add a slim strip that holds `<RatingBadge />` and `<StatsLine />`, centred, with `border-y border-line` and `py-4`.
  - Replace the `HERO` / `GALLERY` constants with `HOME_BAND_IDS`, an explicit list of 6 gallery ids that leads with the strongest `home/real-*` photos from Task 5. Make the band render from it.

- [ ] **Step 3: Run** `npm run build`. Expected: success.

- [ ] **Step 4: Visual check against the mockup at desktop width.** Use `preview_start` `static-out` after the build. The frame corners, the side scrolls and "UNDER THE MILAN" breaking the bottom line should match the mockup.

- [ ] **Step 5: Mobile check at 375px:**
  - Run `document.documentElement.scrollWidth <= innerWidth` in the browser. Expected: `true`.
  - The side scrolls are hidden, the tiles are 2×2 and the numbers are stacked.
  - Tapping a number opens `wa.me/919441361086…`.

- [ ] **Step 6: Commit** with the message `feat(home): flyer-style hero with ornamental frame and real photos`.

### Task 8: Final verification

- [ ] **Step 1:** Run `npm test` and `npm run lint`. Expected: all pass with no errors.

- [ ] **Step 2:** Run `npm run build`, then `grep -rniE "open 24|milan_supplying_company_event|\"Amjad\"" src out`. Expected: no matches. "Amjad" may appear only in the About founder line.

- [ ] **Step 3:** Run a browser pass on `static-out`:
  - The Home hero.
  - The Gallery: the Sofas and Chairs & Tables tabs show the right photos, and the lightbox links to Furniture & Seating.
  - The Contact page: there is no 360 block, and "Milan Group" is listed as the contact.
  - The About page shows the founder line.
  - The footer shows all 5 social icons. Open each one and check that it reaches the right profile.
  - Take a screenshot of the hero for the user.

- [ ] **Step 4:** If any fix was needed, commit with the message `chore: round-1 verification fixes`.
