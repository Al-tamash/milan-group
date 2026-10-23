# Customer feedback round 1: flyer hero and fixes

Date: 2026-10-23
Branch: `feature/phase-1-preview`

## Why

The customer reviewed the first preview (milan-group.vercel.app) on 22 Oct 2026. They said it is "mostly fine" and sent a list of changes, along with their printed flyer and 21 real photos (`C:\Users\Mohd Azimullah\Downloads\milan group img`). They want the home page to open the way their flyer does: **MILAN GROUP / Event Rentals / The Complete Set-up Solution**, with the same handshake logo. They will check everything again in the final review.

What success looks like: the customer opens the site and sees their own brand (the flyer), their own photos and their own social accounts. They should not see any of the things they flagged: blurry internet photos, a broken Instagram link, "24 hours" applied to everything, or the late founder listed as a contact.

## Goals

1. Replace the home hero with a flyer-style hero, built in the existing design system.
2. Fix the social links: replace the wrong Instagram link and add Facebook, YouTube, X and the WhatsApp Channel.
3. Show the opening hours as **daily 8 am – 10 pm** (taken from Google Maps), with **24 hours for emergency service only**.
4. Show the founder, **Late Mr. Mohammad Amjad**, on the About page, and take "Amjad" out of every contact list.
5. Make **Super Structure** its own item, separate from the German Hanger.
6. In the gallery, split **Sofas** and **Chairs & Tables** into separate filter tabs.
7. Add **"Verified on Google"** to the rating badge.
8. Reduce blurriness: use the customer's real photos where they fit, and replace the worst internet photos.
9. Prepare a slot for a 360° Street View tour that stays hidden until the customer provides the link.

## Non-goals

- New chair and sofa photos. The customer has been asked for the originals. The current catalog crops stay as they are for now (decision below).
- A real 360° tour. The customer does not have one yet.
- Any redesign beyond the hero. The rest of the site stays as it is.

## Anti-goals (would count as failure even if it "works")

- A hero that looks like a generic template ("eyebrow + heading + intro") instead of the customer's flyer. See memory `human-not-ai-look`.
- Breaking the design system: no new colours or fonts. Gold stays an accent and is never used as a large fill.
- Any social link that has not been checked by actually opening it. A broken link is what the customer complained about.
- Showing an empty 360 frame, or a "coming soon" box.

## Constraints

- Next.js static export, Tailwind v4, tokens in `src/app/globals.css` (`emerald`, `forest`, `gold`, `gold-700`, `ivory`, `champagne`, `line`, `ink`, `muted`), Cormorant (`.font-display`) + Montserrat.
- Content lives in `src/data/*.json`. Change data there rather than hard-coding values into pages.
- Mobile first: 16px side gutter, no horizontal scroll at 375px.
- Real photos from WhatsApp are 1080px squares or smaller. Convert them to WebP at good quality (around 85) and cap them at about 1600px wide. Do not upscale.

---

## 1. Hero (decided, mockup approved)

**Approved mockup:** `docs/superpowers/specs/assets/2026-10-23-hero-mockup.html` (open it in a browser). It is the approved version "Option C v4". The user compared its frame against a zoomed crop of the client's flyer and confirmed that it matches.

Replace the current forest-green split hero in `src/app/page.tsx` with this design, top to bottom, centred:

1. **Background:** `ivory`. Each of two opposite corners (top-left and bottom-right) gets a decorative green and gold ribbon swoosh, an SVG with a thick `emerald` stroke and a thin `gold` stroke beside it, like the flyer. The swooshes are smaller on mobile, are decorative only (`aria-hidden`), and are clipped by the section.
2. **MILAN** in Cormorant at a very large size with wide letter-spacing (about 0.14em), in `emerald`.
3. **GROUP** in Montserrat semibold, small, with very wide tracking (about 0.5em), between two short `gold` hairlines.
4. **Handshake logo** (the existing `LogoMark` drawing) in a **single** oval ring, as on the flyer. The current `LogoMark` has a double ring (gold outer, emerald inner). Either add a variant or a prop for the single emerald ring, or render it inline. The header logo stays unchanged.
5. **The ornamental frame** contains:
   - **"Event Rentals"** in Cormorant with `font-variant: small-caps` (large E and R, smaller capitals for the rest), `emerald`.
   - The **"The Complete Set-up Solution"** pill: `emerald` fill, `ivory` text, Cormorant semibold uppercase, about 0.14em tracking, 1.5px `gold` border.
   - The frame itself is made of 1.3px `gold` lines with:
     - **Corners:** the line takes a short step, rolls into a round curl with an inward spiral, then runs diagonally into the next edge. The SVG paths are in the mockup (`.frame .c`), and the four corners are mirrored copies of one path.
     - **Middle of the left and right sides:** the line breaks and a scroll ornament sits in the gap. Next to the line is a "3"-shaped double curl, then a lens shape pointing outward with a thin centre line, then large C-curls above and below with spiral ends and two small hooks. The SVG is in the mockup (`.flour`). The right side is a mirrored copy.
     - **"UNDER THE MILAN"** sits **on** the bottom edge and breaks the line. It is in Cormorant, uppercase, with wide tracking, on an `ivory` background patch.
   - On mobile (< 700px) the side scrolls are hidden. The corners, lines and "UNDER THE MILAN" stay.
6. **Two phone numbers** with a WhatsApp icon: **94413 61086** and **95508 38576**, separated by a short gold divider. Tapping a number opens WhatsApp chat with that number, using the existing `whatsappLink` helper and the existing `track("whatsapp_click", { location: "hero" })`. Show them side by side on desktop and stacked on mobile.
   - **No separate "WhatsApp us" / "Call us" buttons in the hero.** The user removed these on purpose, because the numbers already do that job. Calling is still available from the header.
7. **Four arch-topped photo tiles** (border radius about 120px 120px 8px 8px, thin `gold` border with a white inner padding), each with a caption in small uppercase: **Tents · Stage · Tables & Chairs · Decor & Lighting**. Four columns on desktop, 2×2 on mobile. Photos:
   - Tents: customer photo `WhatsApp Image 2026-10-22 at 10.01.55 PM.jpeg` (tent with green carpet and white chairs).
   - Stage: keep the current `public/images/home/stage.webp`, because the customer sent no stage photo.
   - Tables & Chairs: customer photo `10.02.12 PM (1).jpeg` (tent with gold-sash chairs and round tables).
   - Decor & Lighting: customer photo `9.56.57 PM (1).jpeg` (marigold canopy).
   - Crop each one to 3:4 around the subject. The builder may swap in a better-fitting customer photo if a crop looks poor.
   - **My call (resolves the size conflict in section 8):** for these hero tiles the minimum source width is **540px**, not 800px. A tile is at most about 210 CSS px wide, so 540px still covers a 2× screen. The Tables & Chairs crop comes out at about 722px and the Decor crop at about 540px, so both pass. Never upscale.
8. **Service strip** between two `gold` hairlines: TENTS • STAGES • TABLES • CHAIRS • DECOR • LIGHTING • FLOORING • SOUND SYSTEM • ACCESSORIES & MORE (with `gold` bullets).
9. **Motto:** "We Deliver, You Celebrate" in small uppercase with wide tracking, in `gold-700` (`site.motto`).

The H1 must stay semantic. Put "MILAN GROUP" inside the `<h1>`, with "Event Rentals" also in it or right after it. The decorative SVGs are `aria-hidden`.

**My call:** the `RatingBadge` and `StatsLine` that sit in today's hero move to a slim strip directly under the hero (or into the "What we supply" section intro). They are not part of the approved mockup, so they do not go inside it. The Planning / Set-up / Execution / Support icons and the address from the flyer are not added to the hero, because "How it works" and Contact already cover them.

## 2. Social links (all verified by opening them on 2026-10-23)

| Platform | URL | Checked |
|---|---|---|
| Instagram | https://www.instagram.com/milan_s_co_group/ | "Milan Group", 309 followers, bio links to the same Google Maps listing |
| Facebook | https://www.facebook.com/milansupplyingcompany1218 | "Milan S Co Group", phone 094413 61086 (the customer's share link redirects here, so use this clean URL instead of the share link) |
| YouTube | https://www.youtube.com/@Milanscogroup | Channel name "Milan Group" |
| X | https://x.com/CoSupplying | "MILAN Group", same bio as Facebook |
| WhatsApp Channel | https://whatsapp.com/channel/0029Va6JZStL2ATy7zUn2r14 | "Milan Group ™", Since 1995 |

- In `site.json`, replace `instagram` / `instagramHandle` (the old `milan_supplying_company_event` is dead) and add a `socials` list with these five entries.
- **Placement (user decided):** keep the links where Instagram is today: the footer and the Instagram block on the gallery page. **Do not add them to the header or hero.** In the footer, the Instagram line becomes a row of icon links for all five, each with an accessible label. The WhatsApp Channel is labelled **"WhatsApp Channel"** and sits with the social icons. It must not sit next to the green enquiry "WhatsApp us" buttons, because it is not an enquiry route.
- Update the JSON-LD `sameAs` in `layout.tsx` with all five URLs.
- lucide-react has no brand icons for every platform. Use small inline SVGs for Facebook, YouTube, X and WhatsApp.

## 3. Hours

- Google Maps lists **Monday to Sunday, 8 am – 10 pm**.
- Change `site.hours` to "Daily 8 am – 10 pm", and add `site.emergency` = "Emergency service 24 hours".
- Update every place that currently says "Open 24 hours":
  - `src/app/about/page.tsx` (the `COUNT_ON` card): retitle it to something like "Here when it matters", with text saying the office is open daily 8 am – 10 pm and emergency service is available 24 hours.
  - `src/app/page.tsx` (home contact section).
  - `src/components/sections.tsx` (`StatsLine`).
  - The `layout.tsx` meta description.
  - The footer clock line, which shows `site.hours` plus the emergency line.
  - In the `site.json` stats, `"24 hrs" / "Service & support"` becomes `"24 hrs" / "Emergency service"`.
- If the JSON-LD has `openingHours`, update it to `Mo-Su 08:00-22:00`.
- **Open, waiting on the customer:** we do not yet know what emergency service covers (problems at an event already booked only, or new urgent orders too) or which number answers after 10 pm.
  - **Until we hear back:** show only the plain line "Emergency service 24 hours". Do not add a separate phone or WhatsApp link to it, and do not use wording that suggests new bookings at any hour.
  - **When the customer answers:** adjust the wording, and add a contact to the line if they name one.

## 4. Founder and contacts

- The customer wants "Founder ka Name Mr Late Mohammad Amjad aana chaiye, Not in contact". The founder has passed away, so the correct English form is **"Late Mr. Mohammad Amjad"**. Use the spelling the customer wrote.
- **About page:** add a short founder mention in the story section, for example a line or small block reading "Founded in 1995 by Late Mr. Mohammad Amjad". Keep it respectful and plain, with no invented biography.
- **Remove "Amjad" as a contact everywhere:**
  - `site.json` `contacts[0]` (`9441361086`): the name becomes **"Milan Group"** (Truecaller and WhatsApp both show the number under that name), role "Bookings & enquiries".
  - `about/page.tsx` `PEOPLE`.
  - `contact/page.tsx` (`contact("Amjad")`).
  - The home contact line "Ask for Amjad or Asiya Madam" becomes "Ask for Asiya Madam", or the line is dropped. The builder chooses.
  - The footer "Call Amjad" becomes "Call Milan Group".
- Asiya Madam, Fasi, Fazal and Arif stay unchanged.

## 5. Super Structure

- This is a separate item from the German Hanger. The customer's WhatsApp Channel lists "German Hanger/ Pagoda tent on rent" and "Super Stracure on rent" separately.
- Add a product `super-structure` to `products.json` under the tents and roofing service, with its own name, a short plain description (steel/aluminium frame structure for large covered events; do not invent specifications), and images.
- Photos come from the customer's frame shots: `9.52.52 PM.jpeg` (frame against a building), `9.56.56 PM.jpeg` (frame on open ground), `9.56.57 PM.jpeg` (large covered interior with a jeep).
- Add a gallery entry for it under the tents and roofing service.
- **Service page (my call):** `services.json` tents and roofing `items` currently has one row, "German hanger (super structure)", which is exactly the merging the customer objected to. Rename that row to "German hanger" and add a separate "Super structure" row, using a customer frame photo if the row takes an image.
- **Product fields (my call):** the `Product` type requires `features` and `dimensions`. Leave `dimensions` empty. For `features`, use only plain facts visible in the photos, such as "Steel frame" and "Large covered span", with no sizes or capacities.
- The customer will send a reference picture later. Leave a note in the commit or PR. No other placeholder is needed.

## 6. Gallery: Sofas and Chairs & Tables tabs

Today the filter tabs map 1:1 to services. The nine `furniture-and-seating` photos are split into two **gallery-only categories**. The "Furniture & Seating" service page itself stays as one page.

- **Sofas (5):** `furniture-royal-blue-sofa`, `furniture-milan-elegance-sofa`, `furniture-velvet-beige-sofa`, `furniture-emerald-sofa`, `furniture-milan-curve-sofa`.
- **Chairs & Tables (4):** `furniture-banquet-setup`, `furniture-acrylic-chairs`, `furniture-hall-seating`, `furniture-imperia-gold-chair`.
- The tab name "Chairs & Tables" is **my call**, because the banquet photo shows both.
- The lightbox's "service link" for both tabs still points to the Furniture & Seating service page.
- Implementation is the builder's choice. One option is an optional `category` field on gallery items, with the tab list built from categories that fall back to the service. `filterGallery` / `getServiceCounts` in `src/lib/gallery.ts` must keep working, and existing tests in `tests/` must be updated.
- When new customer photos are added (section 8), put them in the right tabs.

## 7. "Verified on Google"

- The Google Maps listing is the customer's own verified business profile (rating 4.2, 27 reviews).
- Add a small "Verified on Google" mark to `RatingBadge` in `src/components/ui.tsx`: a check icon with the text, in both light and dark variants. It still links to `site.mapUrl`.

## 8. Blurry photos

An audit on 2026-10-23 measured the size and sharpness of all 153 images:

- **Chair product photos** (`public/images/products/` aurora, lucent, valeria, cross-back-*, ornate-*, elvira, luna, imperia, regal-flora, lumina, aurelia, aurelian) are about 300×450, cropped from the catalog PDF. The PDF pages are themselves only about 1054×1492 images, so no sharper source exists. **User decision: leave these as they are.** The customer has been asked for the originals, and those will be swapped in a later round. Velvet sofa photos (900×391) are also left as they are.
- **Internet stock photos** in `public/images/items/` (800×600) and some service banners are soft or heavily compressed. The worst are: `items/l-moving`, `items/s-mic`, `services/sound-and-dj`, `items/s-dancefloor`, `items/j-hair`, `items/f-banquet-tables`, `items/t-gazebo`, `items/l-led`, `items/c-water`, `items/l-uplight`, `items/c-brass`, `items/k-cutflower`.
  - **First choice:** swap in a customer photo where one fits:
    - green gazebo `9.53.26 PM.jpeg` → `t-gazebo`. Crop out the "OnePlus 12 / Hasselblad" watermark at the bottom.
    - white hanger `9.58.05 PM.jpeg` → German Hanger product or tents banner.
    - pandal and corridor shots `10.02.12 PM.jpeg`, `9.56.56 PM (1).jpeg` → `t-pandal` / `t-shamiyana` / tents and roofing banner.
    - chair set-ups `10.02.11 PM.jpeg`, `10.02.13 PM (1).jpeg`, `10.02.13 PM.jpeg` → furniture and seating banner / `f-banquet-tables`.
    - gate `10.02.11 PM (1).jpeg` and red night decor `9.58.06 PM.jpeg` → theme or decoration items.
    - The builder decides the exact mapping by looking at each photo.
  - **Otherwise:** replace the photo with a higher-resolution free-licence photo (Unsplash or Pexels) of the same subject, at least 1200px wide, exported as WebP at about quality 85.
- Also add the strongest customer photos to the gallery under the right tabs, and to the home "Some of our set-ups" band.
- **Skip:** `10.01.53 PM.jpeg` (368px, too small), `9.56.58 PM.jpeg` (blue gazebo, 500px, looks like a stock photo), and `9.31.12 PM.jpeg` (the flyer itself).
- Use source images at least 800px wide everywhere except the hero tiles, which have a 540px minimum (see section 1).

## 9. 360° tour slot (hidden until there is a link)

- Add `site.tour360` (empty string for now).
- When it is set, render an embedded Street View / 360 iframe on the Contact page, next to or below the map, with a heading like "Take a look around". When it is empty, render nothing at all.
- The user will supply the embed URL once the customer completes the Google Street View tour.

---

## What's left to the builder

- Exact crops and the mapping of customer photos onto items and banners (guidance above).
- Where the rating badge and stats line go after they leave the hero.
- The component structure for the hero frame (inline SVG pieces versus one component).
- How gallery categories are modelled in data.
- Copy wording for the hours card and the founder line, kept plain and in line with `human-not-ai-look`.

## Verification

- `npm run build` passes and existing tests pass, with gallery tests updated.
- Check in the browser preview at 375px and at desktop width:
  - The hero matches the mockup, including the frame corners, the side scrolls on desktop and "UNDER THE MILAN" on the bottom line.
  - There is no horizontal scroll.
  - The numbers open WhatsApp.
- Every social link opens the right profile.
- No "Open 24 hours" remains (`grep -ri "open 24"` returns nothing in `src/`).
- No "Amjad" remains in any contact list. It appears only in the founder line.
- The gallery shows the Sofas and Chairs & Tables tabs with the right photos.
- The 360 block does not render while `tour360` is empty.
