# Milan Group Website — Plan & Decisions

Living record of the grilling session. Decisions are added as they are settled.

## Inputs from customer

1. **Visiting card** (Milan Group, "24 Hours Services")
   - Contacts: Amjad 9441361086 · Asiya Madam 9550838576 · Fasi 7981148733 · Fazal 8096373015 · Arif (Wedding Flower Work) 9110774085, 8074335046
   - Address: Plot No. 479, Phase-II, Road No. 86, Jubilee Hills, Hyderabad-500033, Telangana
   - Web: www.milansupplyingcompany.com · Social: milan_supplying_company_event
   - Service groups: Supplying Company, Exclusive Articles, Theme Functions, Types of Roof, Sound Work, Season Articles, Electrical Works, Calcutta Decoration, Jewellery, Wedding Flower Work
2. **Catalog PDF** — 44 pages, image-only (no text layer), 32 MB
   - p0: cover — "Event Rentals · The Complete Set-up Solution · We Deliver, You Celebrate"
   - p1–23: chair collections (Ornate Gold/Brown/Black/White/Acrylic, Cross-Back in 6 colours, Luna Oval, Regal Flora, Aurora, Imperia Chiavari, Valeria's Crown, Elvira, Aurélia, Aurelian Gold Chiavari, Lumina, Lucent)
   - p24–26: Tonate, Acrylic, Rattan chairs
   - p27–39: sofas (Ivory Classic, Dusty Pink, Ivory Velvet, Heritage, 9 velvet colours)
   - p40–43: tents (3x3 m Pagoda, 20x20 ft Pagoda, German Hanger, Imported German Aluminium Pagoda)

## Already prepared

- `assets/catalog/p00.jpg … p43.jpg` — each PDF page exported as JPG (~11 MB total)
- `assets/tents.jpg`, `stage.jpg`, `tables.jpg`, `decor.jpg`, `logo-mark.png` — cropped from the cover

## Decisions

| # | Decision | Answer |
|---|----------|--------|
| D1 | Tech stack | Next.js with `output: 'export'` (static HTML) |
| D2 | Site goal | Browse + enquire. "Enquire on WhatsApp" on every product with pre-filled product name. **No prices, no online booking/payment** |
| D3 | Domain & hosting | **Domain not decided yet — a new one will be purchased.** `milansupplyingcompany.com` (printed on the card) was unregistered per the .com registry on 2026-10-21. Site URL kept in one config value; until purchase, site runs on the free `*.pages.dev` address. Host on **Cloudflare Pages (free)** — Vercel Hobby rejected (non-commercial only, no custom events). Verify Cloudflare free-plan terms before deploy |
| D24 | Analytics | **Google Analytics 4 (free)** with click events on WhatsApp, Call and "Send Enquiry" buttons |
| D5 | Content scope | Everything with photos: all card service categories + full product catalog. **Customer must supply photos for non-catalog services** |
| D6 | Contacts | Primary WhatsApp/call: Amjad 9441361086, Asiya Madam 9550838576. Arif under Wedding Flower Work. All 5 on Contact page. Confirm with customer which numbers are on WhatsApp |
| D7 | Language | English only |
| D4 | Colours & fonts | **Royal Emerald**: Emerald `#134E3A`, Deep Forest `#0E2E22` (footer/dark bands), Gold `#C9A84C` (accent only, never large fills), Ivory `#FDF8F0` (page bg), Champagne `#F5E6C8` (cards/sections), Ink `#1F2A24` (text). Headings **Cormorant Garamond** (≥24px only — hairlines break at small sizes); body/nav/buttons **Montserrat**. All Google Fonts |
| D8 | Site structure | Home, Services, Catalog (Chairs/Sofas/Tents + product pages), Gallery, About, Contact. Floating WhatsApp button on every page |
| D9 | Product content | **No PDF pages / catalog sheets on the site.** The website must fully replace the PDF and the card. Every product shown with real photos (originals requested from customer; crop from PDF only as fallback) and all specs, dimensions, colour options as real HTML text |
| D10 | Missing service photos | Free stock photos (Unsplash/Pexels) as temporary placeholders, marked as such in the data; swap for customer photos as they arrive |
| D11 | Local SEO | Yes: Google Business Profile, embedded map, per-page title/description, LocalBusiness schema. Map: https://maps.app.goo.gl/7yPNR2mVQcQpzAEs8 |
| D12 | Instagram | Link only, no feed for now |
| D13 | Content updates | Developer edits JSON data files and redeploys. No CMS |
| D8a | Page architecture | ~8 templates → ~43 static pages: `/`, `/services`, `/services/[slug]` (9), `/catalog`, `/catalog/[category]` (chairs, sofas, tents), `/catalog/[category]/[product]` (~24), `/gallery`, `/about`, `/contact`, 404 |
| D14 | Colour variants | One page per product with colour-swatch switcher (Ornate ×5, Cross-Back ×6, Velvet Sofa ×9 are single products) |
| D15 | Specs data | Developer transcribes specs/dimensions/colours from the PDF into JSON; customer verifies via a review sheet before launch |
| D16 | Product naming | Catalog display name as heading (e.g. "Aurora Pure Clear Chair"); Model Name (e.g. "Milan Elegance") shown small beneath |
| D17 | Enquiry flow | "Add to Enquiry" list (browser-only, localStorage) + event details → one pre-filled WhatsApp message. Direct WhatsApp button also kept on each product |
| D19 | Code setup | Next.js App Router + TypeScript + Tailwind CSS v4, data in `data/*.json`, images pre-resized to WebP with sharp at build time |
| D20 | Enquiry fields | Required: name, event date, venue/area. Optional: guest count, event type, notes. Per item: quantity + colour |
| D21 | Service pages | 9 pages: Furniture & Supplies (Supplying + Exclusive Articles), Tents & Roofing, Sound & DJ, Lighting & Electrical, Calcutta Decoration, Wedding Flower Work, Theme Functions, Season Articles, Jewellery |
| D22 | About page | Developer drafts copy; facts (founding year, experience, event count, service area) left `[TBD]` until customer provides. No invented numbers |
| D23 | Reviews | Real Google Maps reviews only, never written/sample ones. Phase 1: "4.2 ★ · 27 Google reviews" badge + "Read reviews on Google" link. Phase 2: 2–3 real review cards once customer collects 5–6 good reviews |
| D27 | Address | Use the card address everywhere: Plot No. 479, Phase-II, Road No. 86, Jubilee Hills, Hyderabad-500033, Telangana. Customer to correct the Google listing to match |
| D28 | Hours | "24 Hours Services" as on the card. Customer to update Google listing hours to match |
| D29 | Business name | Main name "Milan Group"; tagline "Event Rentals & Supplying Company · Hyderabad" |
| D30 | Queens Collection | Out of scope |
| D31 | Logo | Recreate as SVG: "MILAN GROUP" in Cormorant Garamond + simple handshake icon (also favicon). Swap for original if customer sends it |
| D32 | Privacy | Short `/privacy` page (GA4 data + enquiry details go only to WhatsApp), linked in footer. Total ≈ 44 pages |
| D25 | Launch | Phased. Phase 1 = catalog + stock placeholders + confirmed facts (spec review D15 must be done first). Phase 2 = real photos, About facts |
| D18 | Enquiry recipient | Default WhatsApp: Amjad 9441361086. Flower enquiries → Arif. To be confirmed by customer |

## Google Business Profile (checked 2026-10-21, limited logged-out view)

- Name: Milan Group (Telugu: మిలన్ సరఫరా కంపెనీ) · Category: Event management company
- Rating **4.2 ★ from 27 reviews** · 939 photos
- Address on listing: Road No. 86, Paramount Hills, Hakimpet, Jubilee Hills, Hyderabad, Telangana **500028** (card says **500033**) · Plus code CC59+67
- Coordinates: 17.4080518, 78.4181941
- Hours on listing: "Closes 10 pm" (card says "24 Hours Services")
- Phone on listing: 094413 61086 (Amjad)
- **No website on the listing** → add the new site URL after launch
- Same location also has "Queens Collection by Milan Group" (clothing shop, 5.0 ★, 7 reviews)
- Visible reviews (only 3 of 27 shown logged-out): 1 negative ("very bad experience", a year ago), 2 positive but short ("Nice management…", "Variety of banquet arrangements, crockery & economical")

## Pending on customer

- Choose and buy the new domain (D3)
- Which numbers have WhatsApp (D6)
- Photos for services not in catalog (D5)
- Original high-res product photos from whoever designed the catalog PDF (D9)
- Whether a Google Business Profile already exists (D11)

- Original logo file (D31)
- Correct Google listing address and hours to match the card (D27, D28)
- Ask happy clients for Google reviews (D23)

## Build status (Phase 1, 2026-10-21)

- Built: 43 public pages + enquiry + 404, static export in `out/` (`npm run build`)
- Product photos cropped from the PDF (`scripts/crop-catalog.py`) as the D9 fallback — replace with originals
- Services without customer photos (Sound & DJ, Calcutta Decoration, Theme Functions, Season Articles, Jewellery) use free Unsplash-licence stock photos in `public/images/services/`, labelled "Representative photo" on the site; source links in `services.json` → `imageCredit`. Replace with customer photos and set `imagePlaceholder: false`
- GA4 is wired but off until `NEXT_PUBLIC_GA_ID` is set at build time
- Site URL in `src/data/site.json` (`url`) is a placeholder until the domain is bought
- Customer review sheet: `docs/spec-review.md` (must be checked before launch, D15)

## Service page redesign — decisions (2026-10-21)

Context: this build is a **preview for the customer to review**, not a live launch. Anything written from the developer's general knowledge is listed in `docs/content-review.md` for the customer to confirm or correct before go-live.

| # | Decision | Answer |
|---|----------|--------|
| D33 | Split Furniture & Supplies | Yes → **Furniture & Seating** + **Catering & Kitchen Supplies** (10 services) |
| D34 | Furniture list | Add typical items from general knowledge (tables, lounge sets, carpets) for the preview; customer verifies |
| D35 | Service hero | Full-width photo hero with heading, promise, buttons, trust chips |
| D36 | Item tiles | Photo tiles (stock where no customer photo), not icons |
| D37 | FAQ | Write answers from general knowledge; customer verifies in preview |
| D38 | Service enquiry | "Add to enquiry" for a whole service, same list as products |
| D39 | Stats | Business running **since 1995** (from developer). Show 30+ years and an estimated event count — estimate flagged for customer confirmation before go-live |
| D40 | Template | Same 9-section flow on all 10 services, sections hidden when empty. Re-audit every service's content, not just furniture |
| D41 | Services-only site (2026-10-21) | Sales team brief: not e-commerce, few pages. **Supersedes D8a, D9, D14, D17, D20, D38** and the enquiry-list part of D32. No /catalog, no product pages, no enquiry list or form. Chairs, sofas and tents shown as grouped photo tiles inside Furniture & Seating and Tents & Roofing; tap to pick, one pre-filled WhatsApp message. Template patterns removed (no eyebrow labels, cards only for tappable tiles), copy rewritten in plain local voice (see content-review.md). Spec: docs/superpowers/specs/2026-10-21-services-only-simplification-design.md |

**Built (2026-10-21):** 10 services rewritten (`src/data/services.json`), new 9-section template (`src/app/services/[slug]/page.tsx`), 48 stock item photos in `public/images/items/` + sharp stock heroes in `public/images/services/` (source links in `imageCredit`, full list in the scratchpad picks), stats strip on Home/About/Services, whole-service "Add to enquiry". Customer review sheet: `docs/content-review.md`.

Content audit — what changed from the card's wording:
- "Supplying" / "Exclusive articles" → split into Furniture & Seating and Catering & Kitchen Supplies
- Deep freezers, ice boxes, water dispensers → Catering (keep food/drink cold); Season Articles = guest comfort only
- Tents: "Super structure" explained as German hanger; two "pipe pandal" lines merged
- Sound: "DJ 1 pin 2 pin" → "DJ set-ups (small & large)"; added microphones
- Lighting: "Daylight" → flood lights, "LED power cans" → uplighting, "Ferri" → fairy lights
- Calcutta: "Pandari" → Pandiri (Telugu wedding canopy), "Banti" → marigold; added an explanation of Calcutta decoration
- Wedding flowers: "Dripping" / "Masking" explained; Telugu rituals named
- Jewellery → renamed "Flower Garlands & Jewellery" (avoids gold-jewellery confusion)

## Service page redesign — proposal (2026-10-21)

Competitor findings (Hyderabad): New Jubilee Tent House (services.php) splits **Furniture & Seating** and **Catering Equipment** into separate services and shows each item as a card (photo + one line + Book Now). MARK Events groups inventory into numbered categories, each item with "best for" events, plus a stats strip and one-vendor promise. US rental sites add FAQ, delivery/setup/clean-up promise, wish-list + quote. Note: New Jubilee's reviews and phone numbers look like placeholders — do not copy that pattern (D23).

Proposed section flow for every service page:
1. Photo hero — full-width real photo, H1 "<Service> on Rent in Hyderabad", one-line promise, WhatsApp + Add to enquiry, trust chips (24 Hours Services · Delivery & set-up · 4.2★ Google)
2. "What you get" — visual tiles (photo or icon + name + one line), replacing the bullet checklist
3. Products for rent (only services with catalog items)
4. Perfect for — event-type chips
5. How it works — 4 steps (Planning → Set-up → Execution → Support)
6. Real set-up photos (Phase 2)
7. FAQ — 4–5 questions (answers from customer)
8. Enquiry band — send this service as one WhatsApp enquiry
9. Often booked together — 3 hand-picked related services

## Open questions

None — design tree complete (2026-10-21). Awaiting developer confirmation before build.
