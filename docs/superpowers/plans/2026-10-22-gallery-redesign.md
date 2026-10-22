# Milan Group Gallery Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive, comprehensive, and high-converting Gallery page for Milan Group featuring service-based filter tabs (covering all 10 services + All Work), an expanded authentic image dataset, a responsive masonry grid, and a minimalist fullscreen Lightbox with 1-tap WhatsApp booking enquiry.

**Architecture:**
- **Data & Helpers:** Expand `src/data/gallery.json` to 25–35 authentic setup photos mapped across all 10 services. Add strictly-typed utilities in `src/lib/gallery.ts` for filtering, count calculation, and WhatsApp message construction.
- **UI Components:** Implement `src/components/gallery/GalleryLightbox.tsx` (an accessible `<dialog>` modal with keyboard/swipe navigation and WhatsApp CTA) and `src/components/gallery/GalleryView.tsx` (client component managing filter tabs, live count badges, and responsive grid).
- **Page Assembly:** Update `src/app/gallery/page.tsx` as a Server Component rendering `PageHero`, passing gallery items to `GalleryView`, and retaining the bottom Instagram/consultation section.

**Tech Stack:** Next.js 16.4 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Lucide React, Node.js native test runner (`node:test`).

**Spec:** `docs/superpowers/specs/2026-10-22-gallery-redesign-design.md`

## Global Constraints

- Keep the site's Royal Emerald palette: emerald `#134e3a`, forest `#0e2e22`, gold `#c9a84c`, ivory `#fdf8f0`, champagne `#f5e6c8`, ink `#1f2a24`.
- Cormorant Garamond for display headings (`font-display`), Montserrat for body (`font-sans`).
- No e-commerce cart, checkout, or price tags.
- Lightbox must strictly show the image, setup caption, service link, and WhatsApp enquiry button (no venue sizes, setup timings, or specs clutter).
- Clean code without `any`. Follow Next.js 16 & React 19 patterns.

## Review Focus

1. **Empty filter tab**: If a service tab has 0 photos, the UI must gracefully handle it (though our dataset will populate all 10 services).
2. **Lightbox boundary navigation**: Next on the last image wraps to index 0; Previous on index 0 wraps to the last image.
3. **Esc key & backdrop click**: Pressing `Escape` or clicking the backdrop must close the modal and restore focus.
4. **WhatsApp link encoding**: Special characters and ampersands in captions (e.g., "Tents & Roofing") must be safely URI-encoded.
5. **Mobile horizontal overflow**: Long filter tab names on small screens must scroll horizontally in a clean rail without blowing out the page width.

---

### Task 1: Gallery Data Model, Helper Functions & Test Suite

**Files:**
- Create: `src/lib/gallery.ts`
- Create: `tests/gallery.test.ts`
- Modify: `src/data/gallery.json`
- Modify: `src/lib/data.ts:70-80`

**Interfaces:**
- Produces in `src/lib/gallery.ts`:
  ```typescript
  export type GalleryItem = {
    id: string;
    src: string;
    caption: string;
    service: string;
    alt?: string;
  };

  export function filterGallery(items: GalleryItem[], serviceSlug: string): GalleryItem[];
  export function getServiceCounts(items: GalleryItem[], services: { slug: string; name: string }[]): Record<string, number>;
  export function buildGalleryWhatsAppMessage(photoCaption: string, serviceName?: string): string;
  ```

- [ ] **Step 1: Write the failing tests in `tests/gallery.test.ts`**
  ```typescript
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
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npm test`
  Expected: FAIL with "Cannot find module '../src/lib/gallery.ts'"

- [ ] **Step 3: Implement `src/lib/gallery.ts` and expand `src/data/gallery.json`**
  - Implement `filterGallery`, `getServiceCounts`, and `buildGalleryWhatsAppMessage`.
  - Populate `src/data/gallery.json` with 25–35 entries mapping real photos from `public/images/` across all 10 services:
    - `tents-and-roofing`: german hanger, pagodas (20x20, 3x3), garden tents
    - `furniture-and-seating`: velvet sofas (royal blue, beige, blush), banquet tables, chiavari chairs
    - `wedding-flower-work`: stage, decor, floral pillars
    - `theme-functions`: theme function backdrops
    - `calcutta-decoration`: calcutta floral artwork
    - `lighting-and-electrical`: chandeliers and fairy light walkway
    - `catering-and-kitchen`: buffet and dining supplies
    - `sound-and-dj`: sound and audio console
    - `season-articles`: coolers and misty fans
    - `jewellery`: stage jewellery and accessories
  - Export types and helper in `src/lib/data.ts`.

- [ ] **Step 4: Run test to verify it passes**
  Run: `npm test`
  Expected: PASS

- [ ] **Step 5: Commit data layer changes**
  Run:
  ```bash
  git add src/lib/gallery.ts src/data/gallery.json src/lib/data.ts tests/gallery.test.ts
  git commit -m "feat(gallery): add gallery data model, helpers, and expanded image catalog"
  ```

---

### Task 2: Minimalist Lightbox Component (`GalleryLightbox.tsx`)

**Files:**
- Create: `src/components/gallery/GalleryLightbox.tsx`

**Interfaces:**
- Consumes from `src/lib/gallery.ts`: `GalleryItem`, `buildGalleryWhatsAppMessage`
- Consumes from `src/lib/data.ts`: `getService`, `whatsappLink`
- Produces:
  ```typescript
  export function GalleryLightbox({
    photos,
    activeIndex,
    onClose,
    onNavigate,
  }: {
    photos: GalleryItem[];
    activeIndex: number | null;
    onClose: () => void;
    onNavigate: (index: number) => void;
  }): React.JSX.Element | null;
  ```

- [ ] **Step 1: Implement `GalleryLightbox`**
  - Use native `<dialog>` element with `showModal()` on mount / open, `close()` on dismiss.
  - Implement keyboard navigation:
    - `Escape` calls `onClose()`
    - `ArrowLeft` calls `onNavigate((activeIndex - 1 + photos.length) % photos.length)`
    - `ArrowRight` calls `onNavigate((activeIndex + 1) % photos.length)`
  - Top header:
    - Counter (e.g. `3 of 28`)
    - Service badge linking to `/services/${photo.service}/`
    - Close icon button (`aria-label="Close lightbox"`)
  - Center:
    - Full-resolution `next/image` with `sizes="(max-width: 1024px) 95vw, 80vw"` and `object-contain`
    - Left/Right floating chevron buttons for desktop and mobile tap
  - Bottom Bar:
    - Setup caption text in `text-ivory` / high-contrast readability
    - WhatsApp Action Button:
      ```tsx
      <a
        href={whatsappLink(buildGalleryWhatsAppMessage(photo.caption, service?.name))}
        target="_blank"
        rel="noopener"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-2.5 text-sm font-semibold text-white hover:bg-whatsapp/90 shadow-md"
      >
        <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
      </a>
      ```
    - Strictly no extra fluff (no venue dimensions, no setup timeline clutter).

- [ ] **Step 2: Commit Lightbox Component**
  Run:
  ```bash
  git add src/components/gallery/GalleryLightbox.tsx
  git commit -m "feat(gallery): add minimalist GalleryLightbox component with WhatsApp CTA"
  ```

---

### Task 3: Interactive Filter Tabs & Responsive Grid Component (`GalleryView.tsx`)

**Files:**
- Create: `src/components/gallery/GalleryView.tsx`

**Interfaces:**
- Consumes from `src/lib/gallery.ts`: `GalleryItem`, `filterGallery`, `getServiceCounts`
- Consumes from `src/lib/data.ts`: `Service`
- Consumes from `src/components/gallery/GalleryLightbox.tsx`: `GalleryLightbox`
- Produces:
  ```typescript
  export function GalleryView({
    items,
    services,
  }: {
    items: GalleryItem[];
    services: Service[];
  }): React.JSX.Element;
  ```

- [ ] **Step 1: Implement `GalleryView`**
  - "use client" directive for interactive tab selection and lightbox state.
  - State:
    - `activeTab`: string (default `"all"`)
    - `lightboxIndex`: number | null (default `null`)
  - Filter Bar:
    - Horizontal scrollable rail on mobile (`overflow-x-auto review-rail flex gap-2 pb-2`).
    - Buttons for `"all"` ("All Set-ups") and each of the 10 services.
    - Pill styling: Active tab gets `bg-emerald text-ivory border-emerald shadow-sm`, inactive tab gets `bg-white border-line text-ink hover:border-gold`.
    - Counter badge inside each button (e.g. `<span className="ml-1.5 rounded-full bg-champagne/60 px-2 py-0.5 text-xs font-semibold text-forest">...</span>`).
  - Responsive Grid:
    - `columns-1 gap-4 sm:columns-2 lg:columns-3` or CSS grid with auto-fit.
    - Card elements:
      - `next/image` with rounded corners.
      - Caption displayed cleanly beneath or as subtle overlay.
      - Service pill tag.
      - Hover state: zoom-in cursor (`cursor-zoom-in`), subtle gold border highlight.
      - Accessible `button` or `div[role="button"][tabIndex=0]` triggering `setLightboxIndex(index)`.
  - Empty State:
    - If `filteredItems.length === 0`, display a friendly fallback with button to reset to "All Set-ups".

- [ ] **Step 2: Commit GalleryView Component**
  Run:
  ```bash
  git add src/components/gallery/GalleryView.tsx
  git commit -m "feat(gallery): add GalleryView component with 10-service filter rail and grid"
  ```

---

### Task 4: Integrate Gallery Page & Verification

**Files:**
- Modify: `src/app/gallery/page.tsx`

- [ ] **Step 1: Update `src/app/gallery/page.tsx`**
  - Import `GalleryView` from `@/components/gallery/GalleryView`.
  - Import `services` from `@/lib/data`.
  - Import `gallery` from `@/data/gallery.json`.
  - Render `PageHero` with title "Our set-ups & events" and description.
  - Render `<GalleryView items={gallery} services={services} />`.
  - Retain bottom Instagram section & WhatsApp consultation CTA.

- [ ] **Step 2: Run test suite**
  Run: `npm test`
  Expected: All tests pass.

- [ ] **Step 3: Run production build & lint**
  Run: `npm run build`
  Expected: Build succeeds without TypeScript errors, page prerenders `/gallery/` correctly.

- [ ] **Step 4: Commit and finalize**
  Run:
  ```bash
  git add src/app/gallery/page.tsx
  git commit -m "feat(gallery): integrate redesigned gallery view with service filters and lightbox"
  ```
