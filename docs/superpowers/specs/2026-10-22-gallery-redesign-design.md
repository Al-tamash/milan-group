# Milan Group Gallery Redesign — Design Document

Date: 2026-10-22 · Status: awaiting developer approval

## 1. Intent & Why

Milan Group is a premier event hire and setup company in Hyderabad (specializing in German hangars, pagoda tents, grand wedding stages, royal velvet seating, floral decor, lighting, and kitchen catering).

The current `/gallery/` page (`src/app/gallery/page.tsx`) does not do justice to Milan Group's capabilities:
- It only contains 6 static photos loaded from `src/data/gallery.json`.
- It uses a basic, un-interactive CSS multi-column list without filtering.
- Clicking on an image does nothing; there is no fullscreen lightbox or high-resolution zoom.
- There is no direct, low-friction enquiry path from an inspiring photo to a WhatsApp booking conversation.

The client wants a gallery page where visitors can immediately see the full breadth of everything Milan Group sets up, easily filter by service, preview photos in fullscreen, and directly enquire for any specific setup on WhatsApp.

---

## 2. Goals

1. **Service-Based Filter Navigation (Approach 2)**:
   - Provide dedicated filter tabs matching all 10 services from `src/data/services.json` plus an "All Set-ups" default tab.
   - Show live count badges per tab (e.g., `All (30)`, `Tents & Roofing (6)`, `Furniture & Seating (8)`).
   - Horizontal pill bar on desktop, touch-friendly smooth scroll rail on mobile.
2. **Comprehensive Photo Collection in `gallery.json`**:
   - Expand `gallery.json` using authentic setup photos already present in `public/images/` across all services (home setups, service hero photos, pagoda tents, German hangars, velvet sofa setups, and floral works).
   - Ensure every service tab has real photos so no tab appears empty.
3. **Clean, Human-Crafted Responsive Grid**:
   - Masonry/dynamic grid that gracefully recomposes across breakpoints: 1 column on small mobile, 2 columns on tablet, 3 columns on desktop.
   - Elegant image framing with subtle gold/emerald hover cues and setup title badges.
4. **Focused, Minimalist Fullscreen Lightbox**:
   - Tap any image to open an accessible fullscreen modal.
   - Next / Previous controls, keyboard navigation (Left/Right arrows, Esc to close), and mobile touch-swipe.
   - Clean photo caption and service badge linking to `/services/[service-slug]/`.
   - **Strictly WhatsApp enquiry only**: Prominent button pre-filling a direct WhatsApp message mentioning the exact setup (e.g., *"Hi Milan Group, I saw this setup in your gallery and would like to enquire: [Setup Caption]"*). No venue size, no setup timelines, and no extra clutter.
5. **Preserve Visual Identity**:
   - Stick to the site's Royal Emerald palette (`#134e3a`, `#c9a84c`, `#fdf8f0`, `#1f2a24`, `#e8dcc2`), Cormorant Garamond headings, and Montserrat typography.

---

## 3. Non-Goals

- No e-commerce shopping cart, pricing, or automated checkout system.
- No bulky specification tables, venue dimensions, or setup timelines inside the lightbox (user explicitly requested keeping it strictly to WhatsApp enquiry).
- No new page routes or URL changes (`/gallery/` remains the canonical URL).
- No external third-party heavy slider libraries (use native lightweight React state and HTML `<dialog>` / accessible modal).

---

## 4. Anti-Goals

- **AI-Slop Styling**: Strictly avoid generic purple/indigo gradients, floating glow blobs, artificial card halos, and bouncy animations.
- **Empty Tabs**: Avoid having tabs with zero images. Every active tab must display authentic photos.
- **Mobile Bloat**: Prevent huge, endlessly stacked full-screen cards on mobile; use compact, well-proportioned tiles.

---

## 5. Architectural & Component Plan

### 5.1 Data Layer (`src/data/gallery.json` & `src/lib/data.ts`)
- Structure of each gallery item:
  ```json
  {
    "id": "tents-german-hanger-1",
    "src": "/images/products/german-hanger.webp",
    "caption": "German Hanger Tent with AC & Waterproof Canopy",
    "service": "tents-and-roofing"
  }
  ```
- Curate 25-35 authentic photos covering all 10 services from available assets in `public/images/`.

### 5.2 Interactive Client Component (`src/components/gallery/GalleryView.tsx`)
- Encapsulates state:
  - `activeService`: string (`"all"` or service slug).
  - `activePhotoIndex`: number | null (controls lightbox open/close).
- Filter Tabs:
  - Accessible tab list (`role="tablist"`).
  - Count badges calculated dynamically from the dataset.
  - Active tab highlighted in Milan Emerald (`bg-emerald text-ivory`) with gold accents.
- Gallery Grid:
  - Smoothly displays filtered photos.
  - Focus and hover states with setup caption overlay.
  - Clicking any photo opens the Lightbox at that photo's index.

### 5.3 Minimalist Lightbox (`src/components/gallery/GalleryLightbox.tsx`)
- Native `<dialog>` or accessible portal overlay with backdrop.
- Full-resolution image preview with `object-contain`.
- Controls:
  - Close button (X) and Esc key handler.
  - Previous / Next buttons and ArrowLeft / ArrowRight handlers.
  - Counter (e.g., `3 of 28`).
- Bottom Action Bar:
  - Caption / title of the setup.
  - Service link: `<Link href="/services/[slug]">View Service Details →</Link>`.
  - WhatsApp CTA Button:
    `https://wa.me/919985223399?text=Hi%20Milan%20Group%2C%20I%20saw%20this%20setup%20in%20your%20gallery%20and%20would%20like%20to%20enquire%3A%20[Caption]`

### 5.4 Main Page (`src/app/gallery/page.tsx`)
- Server Component.
- Renders `PageHero` with breadcrumbs and welcoming intro.
- Passes server-side loaded gallery data to `<GalleryView />`.
- Retains bottom Instagram & WhatsApp call-to-action section.

---

## 6. What's Left to the Builder

- Exact list of initial curated photos mapped to each of the 10 services.
- Micro-interaction transitions between tab filters (instant vs. subtle opacity fade).
- Responsive aspect ratios for portrait vs landscape photos in the masonry grid.
