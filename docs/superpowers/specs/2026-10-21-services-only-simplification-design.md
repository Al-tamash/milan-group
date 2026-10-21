# Services-only simplification and de-templating — design

Date: 2026-10-21 · Status: awaiting developer approval

## Why

Our company's sales team met the client (Milan Group, event rentals, Jubilee Hills, Hyderabad) and closed the deal on these terms:

- This is **not an e-commerce site**. No separate catalog section, no page per chair, no colour-swatch product pages.
- Few pages. A visitor should be able to see **everything the client has** and **enquire easily** (WhatsApp / call).
- The current preview drifted into an e-commerce pattern: `/catalog/` → category → 24 product pages with 41 colour variants and a swatch-driven image switcher, plus an "enquiry list" basket and a checkout-like form.

A design critique of the preview (score 24/40, snapshot in `.impeccable/critique/`) also found the site looks template/AI-made and the copy reads like generic marketing. The developer wants both fixed in the same pass.

The visiting card and catalog PDF describe **one business**: event rentals and set-up. The card lists the 10 services; the PDF only shows detailed designs of chairs, sofas and tents, which belong to two of those services (Furniture & Seating, Tents & Roofing).

## Goals

1. All chairs, sofas and tents are shown **inside their service page** only.
2. Enquiry is one step: pick designs (optional) → WhatsApp opens with a pre-filled message.
3. Remove the template look while keeping the brand.
4. Copy sounds like a real Hyderabad business, in plain Indian English.
5. Fix the concrete defects the critique and detector found.

## Non-goals

- No colour or font change. Keep Royal Emerald palette (D4: emerald `#134E3A`, forest `#0E2E22`, gold `#C9A84C`, ivory `#FDF8F0`, champagne `#F5E6C8`, ink `#1F2A24`), Cormorant Garamond headings, Montserrat body.
- No new pages. `/services/`, `/gallery/`, `/about/`, `/contact/`, `/privacy/` and the 10 service pages stay.
- No prices, booking or payment (D2 unchanged).
- No fake reviews (D23 unchanged). Google reviews section stays Phase 2.

## Anti-goals (would count as failure even if it works)

- Anything that still feels like a shop: carts, baskets, quantity steppers, swatch pickers, "add to cart"-style buttons, per-item pages.
- Replacing one uniform pattern with another (e.g. every section now a full-bleed photo). The fix is **variety chosen per content**, not a new template.
- Cards everywhere. Use a card only where the thing is a discrete, tappable object.

## Information architecture

### Removed
- `src/app/catalog/page.tsx`, `src/app/catalog/[category]/page.tsx`, `src/app/catalog/[category]/[product]/page.tsx`
- `src/app/enquiry/page.tsx`
- `src/components/ProductDetail.tsx`, `src/components/enquiry/*` (EnquiryContext, EnquiryForm, AddServiceButton), `ProductCard` in `ui.tsx`
- `EnquiryProvider` in `src/app/layout.tsx`
- Catalog/product/enquiry URLs from `src/app/sitemap.ts`

No redirects: the site is an unlaunched preview.

### Navigation
- Header: Home · Services · Gallery · About · Contact. Remove "Catalog" and the enquiry icon/count. Keep WhatsApp/Call where they are.
- Footer: replace the "Catalog" column with links to Furniture & Seating and Tents & Roofing (e.g. "Chairs & sofas", "Tents"); remove "Enquiry list".
- 404: "Browse catalog" → "See our services" (`/services/`).

### Data
- `products.json` stays as the source of truth for designs (names, photos, colours, dimensions, features). Product pages go away, the data does not.
- Add a `group` field per product. Groups (developer's call, client verifies):
  - Designer & banquet chairs (8): Ornate, Cross Back, Luna Oval, Regal Flora, Imperia Chiavari, Valeria's Crown, Elvira, Aurelian Gold Chiavari
  - Clear / acrylic chairs (5): Aurora, Aurélia, Lumina, Lucent, Acrylic
  - Wooden chairs (2): Tonate, Rattan
  - Stage sofas (5): all sofas
  - Tents (4): all tents
- `services.json` item `href`s that point to `/catalog/...` (lines ~14, 15, 69, 70) become in-page anchors to the designs section (e.g. `#designs`).
- `lib/data.ts`: drop `productHref`, `categories` if no longer used; keep `productImage`.

## Service page: designs section ("Option B", chosen by developer in mockup)

Only on services whose `catalog` is non-empty (Furniture & Seating, Tents & Roofing). Replaces the current "For rent" section (4 ProductCards + "View all").

- One section, id `designs`, heading in plain words (e.g. "Chairs and sofas we have").
- Rows by `group`. Each row: group name + count, then small photo tiles (front image of the first variant) with the design name under it. Rows wrap on mobile (no horizontal carousel required; builder's call).
- Names follow D16: tile shows the product `name`; the WhatsApp message uses `name` and appends `modelName` in brackets when present, so the client's staff can match it to their own PDF. Product names are not rewritten.
- Under the name, one small line of colours as text when there is more than one ("5 colours: Gold, Brown, Black, White, Clear"). **No swatches, no per-colour photo switching.**
- Tap tile → toggles a ✓ selected state. A small zoom icon on the tile opens a lightbox with that design's photos (all variants' images in a simple sequence) plus dimensions/features if present. Lightbox must be keyboard- and screen-reader-accessible and closable with Esc / back.
- One sticky-on-mobile / inline-on-desktop action bar under the section: "Send on WhatsApp" (+ selected count). It opens `whatsappLink()` with:
  ```
  Hi Milan Group, I liked these: Ornate Chair, Cross Back Chair, Premium Ivory Velvet Sofa – Heritage (MILAN HERITAGE).
  Date: 
  Venue: 
  Guests: 
  ```
  With nothing selected: `Hi Milan Group, I'd like to enquire about <Service name>.` plus the same Date/Venue/Guests lines.
- Selection is in-memory only (no localStorage). Track a GA event `whatsapp_click` with `location: designs-<service>` and the selected count.
- Flower service keeps routing to Arif's number (existing `flowerWhatsApp` logic).

Other service-page changes:
- Hero: remove "Add to enquiry"; keep WhatsApp + Call. Trust chips: keep at most two (e.g. "Delivery & set-up", "Since 1995"); drop rating and hours duplicates here.
- "What you get" items: keep photo + name + line, but **not** as bordered cards (plain figure blocks or a photo-left list; builder's call).
- "Perfect for": plain inline text list, not pills.
- "How it works": the 4 words come from the client's own PDF cover (Planning · Set-up · Execution · Support), so keep the idea but render as one compact strip, not a dark full-width 4-column section. Rewrite step texts in human tone.
- "Often booked together": plain text links with small icons, not cards.
- FAQ stays (accordion).

## Home page

Order:
1. Hero — keep emerald hero, WhatsApp + Call. Replace arched tiles with a straight photo collage (same images). Fold the stats into the hero as one line ("Since 1995 · Jubilee Hills · Open 24 hours"); remove the separate StatsStrip on home.
2. What we supply — the 10 services. Not 10 identical cards: a grouped list (e.g. Set-up: tents, furniture, lighting, sound · Décor & flowers · Supplies) with icon + name + one line, each linking to its page. Furniture and Tents lines mention design counts computed from `products.json` (currently 20 chair & sofa designs, 4 tents).
3. Our chairs & sofas — one strip of 6–8 design photos linking to `/services/furniture-and-seating/#designs`. Replaces both "Rental catalog" and "Featured designs".
4. Occasions — replaces the dead pill list. Developer's call: 6 photo-led tiles (Wedding/Reception, Nikah, Haldi/Mehendi, Pooja/Griha Pravesh, Birthday, Corporate), each with "usually needed" items in one line and a WhatsApp link pre-filled with the occasion. Tiles are tappable, so cards are acceptable here.
5. How it works — compact strip (same as service page).
6. Contact + map — keep.

## De-templating rules (whole site)

- Eyebrow (`.eyebrow`) above a heading: max 2 per page, only where the heading alone is ambiguous. Footer column titles become normal small headings, not eyebrows. `SectionHeading` gets eyebrow/gold-rule optional and off by default; vary alignment (not everything centred).
- Stats strip only on the home hero line; remove from `/services/` and `/about/`.
- Rating badge at most once per page.
- Cards only for discrete tappable objects (design tiles, occasion tiles). Remove card treatment from: service lists, "What you get", related services, services-index package block (make it a plain band), stats.
- Remove decorative image hover-zoom on non-link images.
- Keep the gold rule as an occasional accent, not under every heading.

## Copy (human tone)

Voice: a local business owner talking, plain Indian English, short sentences, concrete nouns. No "elevate / seamless / timeless / under one roof".

- Rewrite: home H1 and intro, section headings, services-index H1 (must differ from home H1), service `promise`/`summary` where generic, How-it-works texts, CTA labels (unify to "WhatsApp us" and "Call"), all 24 product `tagline`s in `products.json` (describe material/use, e.g. "Gold frame, velvet seat — popular for stage family seating").
- Fix `about/page.tsx:36` grammar ("available 24 hours services"). Prefer `site.hours` display "Open 24 hours" where used inline.
- Name real people where it helps ("Call Amjad or Asiya Madam").
- Every rewritten line is added to `docs/content-review.md` for client sign-off (preview rule).

## Accessibility / detector fixes

- Gold text on light backgrounds: use a darker gold token for text (≥4.5:1 on ivory and champagne); keep `#C9A84C` for accents and on dark backgrounds.
- WhatsApp buttons: darker green (≥4.5:1 with white text) or larger/bold text that passes.
- Footer Instagram link overflow (39px): allow wrap/break.
- Mobile tap targets ≥44px: menu button, footer links, header actions.
- "Representative photo" caption ≥11px; logo "GROUP" ≥11px or render as part of the SVG logo graphic with `aria-hidden` and proper accessible name.
- Floating WhatsApp button must not cover the designs action bar or content (hide it on pages where the sticky bar shows, or offset).
- Heading order: no h1 → h3 skips.
- Run `impeccable detect` on `out/` after the build and resolve real findings.

## Docs to update

- `docs/website-plan.md`: supersede D8a (page architecture), D9 (catalog pages), D14 (swatch pages), D17/D20/D38 (enquiry list + form), D32 (privacy text) with a new decision row referencing this spec.
- `src/app/privacy/page.tsx`: remove the enquiry-list/form sentences; keep GA4 + WhatsApp disclosure.

## Left to the builder

Exact layouts, spacing and component structure; lightbox implementation (no new dependency unless needed); whether rows wrap or scroll on mobile; exact copy wording within the voice above; how to vary section openings. Verify on desktop and 375px mobile, then run the detector once.
