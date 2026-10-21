# Services-only Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the catalog/product/enquiry-list pages, show every chair, sofa and tent inside its service page with a pick-and-WhatsApp flow, and strip the template look and marketing copy from the whole site.

**Architecture:** `products.json` stays the source of truth and gains a `group` field. A dependency-free module `src/lib/designs.ts` holds the pure logic (grouping, colour line, WhatsApp message) and is unit-tested with Node's built-in test runner. A client component `DesignsSection` renders the groups on catalog-backed service pages. Catalog, product and enquiry routes plus their components are deleted. Shared UI primitives (`SectionHeading`, `HowItWorks`, buttons, tokens) are changed once and then reused by the page rewrites.

**Tech Stack:** Next.js 15 App Router (`output: 'export'`), React 19, TypeScript, Tailwind CSS v4, lucide-react, Node 24 `node --test` (type stripping) for unit tests.

**Spec:** `docs/superpowers/specs/2026-10-21-services-only-simplification-design.md`

## Global Constraints

- No colour or font change. Palette stays emerald `#134E3A`, forest `#0E2E22`, gold `#C9A84C`, ivory `#FDF8F0`, champagne `#F5E6C8`, ink `#1F2A24`; Cormorant Garamond headings, Montserrat body. Only additions: text-safe gold `--color-gold-700: #86691f` (4.90:1 on ivory, 4.57:1 on champagne) and `--color-whatsapp: #15803d` (5.02:1 with white).
- No prices, booking, payment, cart, basket, quantity stepper, swatch picker, or per-item page anywhere.
- No new runtime dependencies.
- No fake reviews; rating badge at most once per page.
- `.eyebrow` above a heading: max 2 per page. Footer column titles are not eyebrows.
- Cards (border + rounded + white bg) only on discrete tappable objects: design tiles and occasion tiles.
- Copy voice: plain Indian English, short sentences, concrete nouns; banned words: elevate, seamless, timeless, "under one roof", "complete set-up solution" as H1. Every rewritten line goes into `docs/content-review.md`.
- Tap targets ≥ 44px on mobile. Text ≥ 11px. Text contrast ≥ 4.5:1.
- Product names on tiles: `name`. WhatsApp message: `name`, plus ` (modelName)` when `modelName` exists.
- Flower service keeps routing WhatsApp to `site.flowerWhatsApp`.

## Review Focus

- Nothing selected → message must still be useful (service name + Date/Venue/Guests lines). Test in Task 1.
- Tapping the zoom icon must not also toggle selection; tapping the tile must not open the lightbox. Checked in Task 2 Step 6.
- Lightbox must close with Esc and with the close button, and return focus to the zoom button. Checked in Task 2 Step 6.
- Sticky WhatsApp bar on mobile must not be covered by the floating WhatsApp button. Checked in Task 2 Step 6.
- After deletions, no link anywhere points to `/catalog` or `/enquiry` (404 in static export). Checked in Task 3 Step 4.

---

### Task 1: Design grouping data and pure helpers (TDD)

**Files:**
- Modify: `src/data/products.json` (add `"group"` to all 24 products)
- Modify: `src/lib/data.ts` (add `group` to `Product`)
- Create: `src/lib/designs.ts` (no `@/` imports; types only, so Node can run it)
- Create: `tests/designs.test.ts`
- Modify: `package.json` (add `"test": "node --test tests/"`)
- Modify: `tsconfig.json` (add `"tests"` to `exclude`)

**Interfaces:**
- Produces (in `src/lib/designs.ts`):
  - `type DesignGroup = "designer-chairs" | "clear-chairs" | "wooden-chairs" | "sofas" | "tents"`
  - `const GROUP_LABELS: Record<DesignGroup, string>` = `{ "designer-chairs": "Designer & banquet chairs", "clear-chairs": "Clear / acrylic chairs", "wooden-chairs": "Wooden chairs", sofas: "Stage sofas", tents: "Tents" }`
  - `type DesignLike = { slug: string; name: string; modelName?: string; category: string; group: DesignGroup; variants: { name: string }[] }`
  - `groupDesigns<T extends DesignLike>(items: T[], categories: string[]): { group: DesignGroup; label: string; items: T[] }[]` — keeps items whose `category` is in `categories`, groups in the `GROUP_LABELS` key order, preserves product order inside a group, omits empty groups.
  - `colourLine(item: DesignLike): string | null` — `null` for ≤1 variant, else `"<n> colours: A, B, C"`.
  - `messageName(item: DesignLike): string` — `name` or `name (modelName)`.
  - `buildDesignsMessage(serviceName: string, selected: DesignLike[]): string`

- [ ] **Step 1: Add `group` to every product in `products.json`**

designer-chairs: ornate-chair, cross-back-chair, luna-oval-chair, regal-flora-chair, imperia-chiavari-chair, valerias-crown-chair, elvira-chair, aurelian-gold-chiavari-chair · clear-chairs: aurora-pure-clear-chair, aurelia-oval-ghost-chair, lumina-acrylic-chair, lucent-chair, acrylic-chair · wooden-chairs: tonate-chair, rattan-chair · sofas: all 5 sofas · tents: all 4 tents. Add `group: DesignGroup` to `Product` in `data.ts` (import the type from `./designs`).

- [ ] **Step 2: Write the failing tests in `tests/designs.test.ts`** (import from `../src/lib/designs.ts`)

```ts
test("groups furniture designs in label order and skips other categories", () => {
  const g = groupDesigns(products, ["chairs", "sofas"]);
  assert.deepEqual(g.map((x) => x.group), ["designer-chairs", "clear-chairs", "wooden-chairs", "sofas"]);
  assert.deepEqual(g.map((x) => x.items.length), [8, 5, 2, 5]);
});
test("tents page gets one Tents group of 4", () => { /* groupDesigns(products, ["tents"]) → [{group:"tents", items.length 4}] */ });
test("colourLine", () => {
  assert.equal(colourLine(ornate), "5 colours: Gold, Brown, Black, White, Acrylic (Clear)");
  assert.equal(colourLine(regalFlora), null);
});
test("message with selection lists names and model names", () => {
  assert.equal(buildDesignsMessage("Furniture & Seating", [ornate, heritage]),
    "Hi Milan Group, I liked these: Ornate Chair, Premium Ivory Velvet Sofa – Heritage (MILAN HERITAGE).\nDate: \nVenue: \nGuests: ");
});
test("message with nothing selected falls back to the service", () => {
  assert.equal(buildDesignsMessage("Tents & Roofing", []),
    "Hi Milan Group, I'd like to enquire about Tents & Roofing.\nDate: \nVenue: \nGuests: ");
});
```

Load `products` with `JSON.parse(readFileSync("src/data/products.json"))`; pick `ornate`, `regalFlora`, `heritage` by slug (`milan-heritage-sofa`).

- [ ] **Step 3: Run `npm test`** — Expected: FAIL (module not found).
- [ ] **Step 4: Implement `src/lib/designs.ts`** per the Interfaces block.
- [ ] **Step 5: Run `npm test`** — Expected: 5 passing. Run `npx tsc --noEmit` — Expected: no errors.
- [ ] **Step 6: Commit** — `git add -A src/lib src/data/products.json tests package.json tsconfig.json && git commit -m "feat: group designs and build WhatsApp design message"`

---

### Task 2: Designs section on service pages

**Files:**
- Create: `src/components/designs/DesignsSection.tsx` (client)
- Create: `src/components/designs/DesignLightbox.tsx` (client)
- Modify: `src/app/services/[slug]/page.tsx:121-138` (replace "For rent" block), `:69` (remove `AddServiceButton`)
- Modify: `src/data/services.json` items with `href` `/catalog/...` (lines ~14, 15, 69, 70) → `"#designs"`
- Modify: `src/components/ContactButtons.tsx` (`FloatingWhatsApp` accepts being hidden: hide when `document.body.dataset.designsBar === "on"`, or simpler: designs bar reserves right padding — implementer's choice, must satisfy Review Focus)

**Interfaces:**
- Consumes: `groupDesigns`, `colourLine`, `buildDesignsMessage`, `GROUP_LABELS` (Task 1); `whatsappLink`, `productImage`, `products` from `@/lib/data`; `track` from `@/lib/analytics`.
- Produces: `<DesignsSection serviceName: string; categories: CategorySlug[]; whatsappNumber?: string; heading: string />` rendering `<section id="designs">`.
- Produces: `<DesignLightbox product: Product | null; onClose: () => void />`.

- [ ] **Step 1: Build `DesignsSection`**: heading (plain h2, no eyebrow), one row per group (`h3` label + count), tiles = button with front image (`variants[0].images[0]`), name, `colourLine`; `aria-pressed` and a ✓ badge when selected; separate zoom `button` (`aria-label="See photos of <name>"`, ≥44px) in the tile corner. Selection state is `useState<string[]>` of slugs, no storage. Tile grid: 3 cols mobile, 5–6 desktop; tiles are the only cards on the page.
- [ ] **Step 2: Action bar**: under the section on desktop, `sticky bottom-0` on mobile while the section is in view. Link "Send on WhatsApp" (+ "· n selected") to `whatsappLink(buildDesignsMessage(...), whatsappNumber)`; on click `track("whatsapp_click", { location: "designs-<slug>", selected: n })`. Plus a "Clear" text button when n > 0.
- [ ] **Step 3: Build `DesignLightbox`** as a native `<dialog>` (`showModal()`): all images of all variants in sequence with prev/next, variant name caption, `dimensions` and `features` lists if present. Esc and close button close it; focus returns to the opener.
- [ ] **Step 4: Wire into the service page**: replace the `service.catalog.map(...)` block with one `<DesignsSection>` when `service.catalog.length > 0` (heading: Furniture → "Chairs and sofas we have", Tents → "Tents we put up"; put the heading in `services.json` as `designsHeading`). Remove `AddServiceButton` import and usage. Update `services.json` hrefs to `#designs`.
- [ ] **Step 5: `npm run build`** — Expected: success.
- [ ] **Step 6: Verify in the browser** (`preview_start` name `static-out`, `/services/furniture-and-seating/` at desktop and `resize_window` mobile): 4 group rows with 8/5/2/5 tiles; tapping two tiles shows "2 selected"; WhatsApp href decodes to the Task 1 message; zoom opens the lightbox without toggling selection; Esc closes it; on mobile the floating WhatsApp button does not cover the bar. `/services/tents-and-roofing/` shows one Tents row of 4. `/services/sound-and-dj/` has no designs section.
- [ ] **Step 7: Commit** — `feat: show designs inside service pages with pick-and-WhatsApp`

---

### Task 3: Remove catalog, product and enquiry-list pages

**Files:**
- Delete: `src/app/catalog/` (all), `src/app/enquiry/page.tsx`, `src/components/ProductDetail.tsx`, `src/components/enquiry/` (all)
- Modify: `src/components/ui.tsx` (delete `ProductCard`), `src/lib/data.ts` (delete `categories`, `getCategory`, `getProduct`, `productHref`, `productsIn` — nothing uses them once Task 2 and Step 1 below are done; keep `productImage`, `CategorySlug`)
- Modify: `src/app/layout.tsx` (remove `EnquiryProvider`)
- Modify: `src/components/Header.tsx` (NAV: Home, Services, Gallery, About, Contact; remove enquiry link/count and `useEnquiry`)
- Modify: `src/components/Footer.tsx:30-41` ("Catalog" column → "Chairs & sofas" `/services/furniture-and-seating/#designs`, "Tents" `/services/tents-and-roofing/#designs`; remove "Enquiry list")
- Modify: `src/app/not-found.tsx:11` ("Browse catalog" → "See our services", `/services/`)
- Modify: `src/app/sitemap.ts` (remove catalog, category, product and `/enquiry/` URLs)
- Modify: `src/app/privacy/page.tsx:17-19,27` (remove enquiry form/list sentences; keep GA4 and WhatsApp disclosure)

**Interfaces:**
- Consumes: nothing new. Home page (`src/app/page.tsx`) still imports `categories`/`ProductCard` until Task 5 — in this task, temporarily delete the home "Rental catalog" and "Featured designs" sections so the build passes; Task 5 adds the replacements.

- [ ] **Step 1: Delete files and update references listed above.**
- [ ] **Step 2: `npm run build && npm run lint && npm test`** — Expected: all succeed.
- [ ] **Step 3: `ls out`** — Expected: no `catalog` or `enquiry` directories.
- [ ] **Step 4: `grep -rn "/catalog\|/enquiry" src out --include=*.tsx --include=*.ts --include=*.html`** — Expected: no matches.
- [ ] **Step 5: Commit** — `refactor: remove catalog, product pages and enquiry list`

---

### Task 4: De-template shared primitives and accessibility fixes

**Files:**
- Modify: `src/app/globals.css` (add `--color-gold-700: #86691f`; set `--color-whatsapp: #15803d`; `.eyebrow` text colour → gold-700)
- Modify: `src/components/ui.tsx` — `SectionHeading({ eyebrow?, title, intro?, align = "left", rule = false })`: no eyebrow unless passed, gold rule off by default, left-aligned by default. `PageHero` eyebrow optional and unused by default. `RatingBadge` unchanged. Hover image zoom only inside links.
- Modify: `src/components/sections.tsx` — `HowItWorks` becomes a compact single strip (4 inline items: icon + word + one short line) on ivory, no dark full-width band, no "STEP n"; texts rewritten (Task 7 owns final wording). `StatsStrip` replaced by `StatsLine` returning one inline line: "Since 1995 · Jubilee Hills · Open 24 hours · 4.2★ on Google".
- Modify: `src/components/Footer.tsx` (column titles as `h3` small caps-free text, not `.eyebrow`; Instagram link `break-all`; links `py-2` / min-h 44px)
- Modify: `src/components/Header.tsx` (menu button ≥ 44×44)
- Modify: `src/components/Logo.tsx` ("GROUP" ≥ 11px)
- Modify: `src/components/ui.tsx` + `src/app/services/[slug]/page.tsx:84` ("Representative photo" text-[11px])
- Modify: `src/app/services/page.tsx`, `src/app/about/page.tsx` (remove `StatsStrip`)

**Interfaces:**
- Produces: `SectionHeading` props `{ eyebrow?: string; title: string; intro?: string; align?: "left" | "center"; rule?: boolean }`; `HowItWorks()` (no props); `StatsLine({ dark?: boolean })`.

- [ ] **Step 1: Apply the token, primitive and component changes above.**
- [ ] **Step 2: `npm run build`** — Expected: success.
- [ ] **Step 3: Detector** — `"/c/Users/Mohd Azimullah/.claude/skills/impeccable/scripts/impeccable" detect --json out/index.html out/about/index.html` — Expected: no `low-contrast` on gold-700 or WhatsApp text, no `text-overflow`, no `undersized-ui-text`.
- [ ] **Step 4: Commit** — `style: drop template patterns from shared components, fix contrast and tap targets`

---

### Task 5: Home page rebuild

**Files:**
- Modify: `src/app/page.tsx` (full rewrite of sections)
- Create: `src/data/occasions.json` — 6 entries `{ slug, name, includes: string, image: string, message: string }` for Wedding & Reception, Nikah, Haldi & Mehendi, Pooja & Griha Pravesh, Birthday, Corporate. Images reuse existing files under `public/images/` (services/items); no new downloads.

**Interfaces:**
- Consumes: `SectionHeading`, `StatsLine`, `HowItWorks` (Task 4); `products`, `productImage`, `services`, `whatsappLink` from `@/lib/data`.

Section order (spec "Home page"):
- [ ] **Step 1: Hero** — keep emerald band, WhatsApp + Call, `RatingBadge` once; replace arched `HERO_TILES` with a straight 2×2 / 1+2 photo collage (square corners or small radius, no `rounded-t-[999px]`, no `mt-8` stagger); `StatsLine dark` under the buttons; remove the separate stats section.
- [ ] **Step 2: What we supply** — services in 3 groups (Set-up: tents-and-roofing, furniture-and-seating, lighting-and-electrical, sound-and-dj · Décor & flowers: wedding-flower-work, calcutta-decoration, theme-functions, flower-garlands-and-jewellery · Supplies: catering-and-kitchen, season-articles). Each row: icon, name, `summary` (one line), link. No cards. Furniture row adds "20 chair & sofa designs", Tents row "4 tent types" (counts computed from `products`).
- [ ] **Step 3: Chairs & sofas strip** — 8 `featured` products (chairs/sofas), image only + name, whole strip links to `/services/furniture-and-seating/#designs`.
- [ ] **Step 4: Occasions** — 6 tappable photo tiles from `occasions.json` (cards allowed): name, "Usually: …" line, link `whatsappLink(message)` with `track("whatsapp_click", { location: "occasion-<slug>" })`.
- [ ] **Step 5: `HowItWorks`, then the existing contact + map block** (eyebrow removed, rating not repeated).
- [ ] **Step 6: Verify** — `npm run build`; browser at desktop and mobile: count `.eyebrow` in `main` ≤ 2 (`document.querySelectorAll("main .eyebrow").length`), rating badge appears once, no link to `/catalog`, mobile page height noticeably below the old 10,908px.
- [ ] **Step 7: Commit** — `feat: simpler home page with grouped services, design strip and occasions`

---

### Task 6: Service page and other pages de-carding

**Files:**
- Modify: `src/app/services/[slug]/page.tsx` — hero trust chips → 2 (Delivery & set-up, Since 1995); "What you get" items as plain photo + text blocks (no border/bg/rounded card, no hover shadow); "Perfect for" as an inline comma list sentence; FAQ heading without eyebrow; "Often booked together" as text links with `ServiceIcon`; at most 2 eyebrows.
- Modify: `src/app/services/page.tsx` — new H1 (different from home), service list as rows (reuse the Task 5 grouped list — extract it to `src/components/ServiceList.tsx` with `ServiceList({ withCounts?: boolean })` and use it on both pages), "Full event package" block as a plain band.
- Modify: `src/app/about/page.tsx` — remove arched tiles (`:44`), eyebrows ≤ 2.
- Modify: `src/app/gallery/page.tsx`, `src/app/contact/page.tsx` — eyebrows ≤ 2, ensure an h2 exists where content sections exist (no h1→h3 skip).
- Delete: `ServiceCard` from `ui.tsx` if unused.

- [ ] **Step 1: Extract `ServiceList` from Task 5 and apply the changes above.**
- [ ] **Step 2: `npm run build && npm run lint`** — Expected: success.
- [ ] **Step 3: Browser check** — on `/services/`, `/services/furniture-and-seating/`, `/about/`, `/gallery/`, `/contact/`: `main .eyebrow` count ≤ 2 each; rating badge ≤ 1; heading order has no skips (`[...document.querySelectorAll("h1,h2,h3")].map(h=>h.tagName)`).
- [ ] **Step 4: Commit** — `style: replace card grids with content-specific layouts`

---

### Task 7: Human-tone copy and docs

**Files:**
- Modify: `src/data/site.json` (`hours` → "Open 24 hours"; `tagline` if template-like)
- Modify: `src/data/services.json` (`heroTitle` keep SEO form "<Service> on Rent in Hyderabad"; rewrite generic `promise`/`summary`/`description` lines)
- Modify: `src/data/products.json` (all 24 `tagline`s: material + use, e.g. "Gold frame, velvet seat — popular for stage family seating"; no "Elegance/Timeless")
- Modify: `src/app/page.tsx`, `src/app/services/page.tsx`, `src/app/about/page.tsx:36` (grammar bug), `src/components/sections.tsx` (How it works lines, e.g. Planning "Send your date, venue and guest count on WhatsApp.", Set-up "Our team brings everything and sets it up before guests arrive.", Execution "Our boys stay at the venue till the function ends.", Support "Call any time, day or night. We clear up after.")
- Modify: `src/components/ContactButtons.tsx` (labels: "WhatsApp us", "Call <number>" everywhere; no other variants)
- Modify: `docs/content-review.md` (new section "Rewritten copy (2026-10-21)" listing every changed line, old → new, with OK/Correction column)
- Modify: `docs/website-plan.md` (add decision D41 superseding D8a, D9, D14, D17, D20, D38, D32-text, referencing the spec)

- [ ] **Step 1: Rewrite copy per Global Constraints voice; grep for banned words** — `grep -rniE "elevate|seamless|timeless|under one roof|complete set-up solution" src` — Expected: no matches.
- [ ] **Step 2: Update both docs.**
- [ ] **Step 3: `npm run build && npm test`** — Expected: success (Task 1 tests use product names and colours, not taglines).
- [ ] **Step 4: Commit** — `content: rewrite copy in plain local voice and record decisions`

---

### Task 8: Final verification

- [ ] **Step 1:** `npm test && npm run lint && npm run build` — all pass.
- [ ] **Step 2:** Detector on built pages: `impeccable detect --json out/index.html out/services/furniture-and-seating/index.html out/services/index.html out/about/index.html` — no `low-contrast`, `text-overflow`, `undersized-ui-text`, `skipped-heading`; `kicker-above-heading` ≤ 2 per page. Note remaining taste flags (cream palette, Montserrat) as accepted by Global Constraints.
- [ ] **Step 3:** Browser pass at desktop and 375px on `/`, `/services/`, `/services/furniture-and-seating/`, `/services/tents-and-roofing/`, `/about/`, `/contact/`; screenshots of home and furniture page for the developer.
- [ ] **Step 4:** Count pages in `out/` (`find out -name index.html | wc -l`) and report.
