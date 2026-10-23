// Recreated SVG logo (D31): handshake in an oval ring + wordmark.
// Replace with the customer's original artwork if they send it.
// `single`: one emerald ring, as on the printed flyer (used by the home hero). The header keeps the double ring.
export function LogoMark({ className = "h-10 w-14", single = false }: { className?: string; single?: boolean }) {
  return (
    <svg viewBox="0 0 56 40" className={className} aria-hidden="true" fill="none">
      {single ? (
        <ellipse cx="28" cy="20" rx="26" ry="18" stroke="#134E3A" strokeWidth="1.6" />
      ) : (
        <>
          <ellipse cx="28" cy="20" rx="26" ry="18" stroke="#C9A84C" strokeWidth="2" />
          <ellipse cx="28" cy="20" rx="22.5" ry="14.8" stroke="#134E3A" strokeWidth="1" />
        </>
      )}
      <g
        transform="translate(16 8) scale(1)"
        stroke="#134E3A"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m11 17 2 2a1 1 0 1 0 3-3" />
        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
        <path d="m21 3 1 11h-2" />
        <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
        <path d="M3 4h8" />
      </g>
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="leading-none">
        <span
          className={`font-display block text-[1.65rem] tracking-[0.14em] ${light ? "text-ivory" : "text-emerald"}`}
        >
          MILAN
        </span>
        <span className={`block text-[0.7rem] font-semibold tracking-[0.4em] ${light ? "text-gold" : "text-gold-700"}`}>
          GROUP
        </span>
      </span>
    </span>
  );
}
