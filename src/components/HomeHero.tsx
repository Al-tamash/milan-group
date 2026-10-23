import Image from "next/image";
import { site } from "@/lib/data";
import { LogoMark } from "./Logo";
import { HeroNumbers } from "./HeroNumbers";

// Home hero built from the customer's printed flyer (round-1 feedback). The approved mockup is
// docs/superpowers/specs/assets/2026-10-23-hero-mockup.html; frame corners and side scrolls are traced from the flyer.

const TILES = [
  { src: "/images/home/hero-tents.webp", label: "Tents", alt: "White tent with green carpet and covered chairs" },
  { src: "/images/home/stage.webp", label: "Stage", alt: "Wedding stage with a gold sofa and flower backdrop" },
  { src: "/images/home/hero-tables.webp", label: "Tables & Chairs", alt: "Round tables and gold-sashed chairs under a tent" },
  { src: "/images/home/hero-decor.webp", label: "Decor & Lighting", alt: "Striped canopy with marigold garlands over rows of chairs" },
];

const SUPPLIES = ["Tents", "Stages", "Tables", "Chairs", "Decor", "Lighting", "Flooring", "Sound System", "Accessories & More"];

const PHONES = [site.contacts[0].phones[0], site.contacts[1].phones[0]];

function Ribbon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 300 300" fill="none" aria-hidden="true" className={`pointer-events-none absolute h-44 w-44 sm:h-80 sm:w-80 ${className}`}>
      <path d="M0 260 C 60 140, 140 60, 300 0" stroke="var(--color-emerald)" strokeWidth="22" opacity=".9" />
      <path d="M0 290 C 70 160, 160 70, 300 26" stroke="var(--color-gold)" strokeWidth="6" />
    </svg>
  );
}

// Corner: the edge steps in, rolls into a curl with an inward spiral, then runs diagonally into the next edge.
function Corner({ className }: { className: string }) {
  return (
    <svg
      viewBox="50 50 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="7"
      strokeLinecap="round"
      aria-hidden="true"
      className={`absolute h-[22px] w-[22px] overflow-visible ${className}`}
    >
      <path d="M180 60H158L142 76C116 74 92 94 94 118C96 138 118 146 132 134C138 128 132 120 126 124" />
      <path d="M60 180V162L70 154H96" />
    </svg>
  );
}

const SCROLL_HALF = (
  <>
    <path d="M352 258C340 252 348 236 362 238C384 240 392 262 384 280C376 296 352 302 330 304" />
    <path d="M62 304C120 292 182 272 202 232C226 182 210 120 168 110C134 104 120 140 140 150C155 158 165 142 152 136" />
    <path d="M196 268C172 254 144 240 132 248C122 256 132 264 140 258" />
  </>
);

// Side scroll that sits in the break of the left/right edge: "3" curl at the line, lens pointing out, C-curls above and below.
function SideScroll({ className }: { className: string }) {
  return (
    <svg
      viewBox="40 90 360 430"
      fill="none"
      stroke="currentColor"
      strokeWidth="9"
      strokeLinecap="round"
      aria-hidden="true"
      className={`absolute top-[calc(50%-6px)] -mt-[35px] hidden h-[70px] w-[58px] md:block ${className}`}
    >
      {SCROLL_HALF}
      <g transform="matrix(1 0 0 -1 0 610)">{SCROLL_HALF}</g>
      <path d="M330 305C300 278 240 278 190 305C240 332 300 332 330 305ZM196 305H318" />
    </svg>
  );
}

function OrnamentFrame({ children }: { children: React.ReactNode }) {
  const line = "absolute bg-current";
  return (
    <div className="relative mx-auto mt-6 max-w-[760px] px-6 pb-10 pt-8 text-gold sm:px-9">
      <span aria-hidden="true" className={`${line} left-5 right-5 top-[1.2px] h-[1.3px]`} />
      <span aria-hidden="true" className={`${line} bottom-[1.2px] left-5 right-5 h-[1.3px]`} />
      {/* Side edges break around the middle where the scroll sits; on mobile the scroll is hidden and the edge is whole. */}
      <span aria-hidden="true" className={`${line} bottom-5 left-[1.2px] top-5 w-[1.3px] md:bottom-[calc(50%+22px)]`} />
      <span aria-hidden="true" className={`${line} bottom-5 left-[1.2px] top-[calc(50%+10px)] hidden w-[1.3px] md:block`} />
      <span aria-hidden="true" className={`${line} bottom-5 right-[1.2px] top-5 w-[1.3px] md:bottom-[calc(50%+22px)]`} />
      <span aria-hidden="true" className={`${line} bottom-5 right-[1.2px] top-[calc(50%+10px)] hidden w-[1.3px] md:block`} />
      <Corner className="left-0 top-0" />
      <Corner className="right-0 top-0 -scale-x-100" />
      <Corner className="bottom-0 left-0 -scale-y-100" />
      <Corner className="bottom-0 right-0 -scale-100" />
      <SideScroll className="-left-[50px]" />
      <SideScroll className="-right-[50px] -scale-x-100" />
      {children}
      <p className="font-display absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 whitespace-nowrap bg-ivory px-4 text-base uppercase tracking-[0.2em] text-emerald sm:text-2xl">
        Under the Milan
      </p>
    </div>
  );
}

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-ivory px-4 pb-12 pt-10 text-center sm:px-6 sm:pt-14">
      <Ribbon className="-left-14 -top-10" />
      <Ribbon className="-bottom-10 -right-14 rotate-180" />

      <div className="relative mx-auto max-w-5xl">
        <h1 className="text-emerald">
          <span className="font-display block text-[3.6rem] leading-none tracking-[0.14em] sm:text-7xl lg:text-[6.75rem]">
            MILAN
          </span>
          <span className="mt-2 flex items-center justify-center gap-4 text-sm font-semibold tracking-[0.5em] before:h-px before:w-12 before:bg-gold after:h-px after:w-12 after:bg-gold sm:text-[0.95rem] sm:before:w-20 sm:after:w-20">
            GROUP
          </span>
        </h1>
        <LogoMark single className="mx-auto mt-4 h-14 w-20" />

        <OrnamentFrame>
          <p className="font-display text-[2.6rem] leading-none tracking-[0.03em] text-emerald [font-variant:small-caps] sm:text-6xl lg:text-[5.25rem]">
            Event Rentals
          </p>
          <p className="font-display mt-4 inline-block rounded-full border-[1.5px] border-gold bg-emerald px-6 py-2 text-[0.95rem] uppercase tracking-[0.14em] text-ivory sm:px-8 sm:text-[1.375rem]">
            The Complete Set-up Solution
          </p>
        </OrnamentFrame>

        <div className="mt-9">
          <HeroNumbers phones={PHONES} />
        </div>

        <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {TILES.map((t, i) => (
            <li key={t.label}>
              <div className="rounded-[120px_120px_8px_8px] border border-gold bg-white p-[3px]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[118px_118px_6px_6px]">
                  <Image
                    src={t.src}
                    alt={t.alt}
                    fill
                    preload={i === 0}
                    sizes="(max-width: 768px) 50vw, 220px"
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="mt-2 text-[0.7rem] uppercase tracking-[0.2em] text-ink sm:text-xs">{t.label}</p>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-7 max-w-4xl border-y border-gold px-2 py-3 text-[0.7rem] uppercase leading-loose tracking-[0.2em] text-ink sm:text-xs">
          {SUPPLIES.map((s, i) => (
            <span key={s}>
              {i > 0 && <span aria-hidden="true" className="mx-2 text-gold">•</span>}
              <span className="whitespace-nowrap">{s}</span>
            </span>
          ))}
        </p>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">{site.motto}</p>
      </div>
    </section>
  );
}
