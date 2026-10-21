"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { productImage, type Product } from "@/lib/data";

// Native <dialog>: Esc, focus trapping and the backdrop come from the browser.
export function DesignLightbox({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(0);

  const shots = product?.variants.flatMap((v) => v.images.map((img) => ({ img, colour: v.name }))) ?? [];

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (product) {
      setI(0);
      if (!d.open) d.showModal();
    } else if (d.open) {
      d.close();
    }
  }, [product]);

  const shot = shots[i];
  const step = (n: number) => setI((x) => (x + n + shots.length) % shots.length);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={product ? `${product.name} photos` : undefined}
      className="m-auto w-[min(56rem,calc(100vw-2rem))] rounded-2xl bg-ivory p-0 text-ink backdrop:bg-black/60"
    >
      {product && shot && (
        <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f6f1e7]">
              <Image src={productImage(shot.img)} alt={`${product.name}, ${shot.colour}`} fill sizes="(max-width: 768px) 90vw, 50vw" className="object-contain p-4" />
            </div>
            {shots.length > 1 && (
              <div className="mt-3 flex items-center justify-between">
                <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className="flex h-11 w-11 items-center justify-center rounded-full border border-line hover:border-gold">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <p className="text-sm text-muted">
                  {shot.colour} · {i + 1} of {shots.length}
                </p>
                <button type="button" onClick={() => step(1)} aria-label="Next photo" className="flex h-11 w-11 items-center justify-center rounded-full border border-line hover:border-gold">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-3xl leading-tight text-emerald">{product.name}</h3>
              <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-champagne">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-sm font-medium text-ink">{product.tagline}</p>
            {product.modelName && <p className="mt-1 text-xs text-muted">Model: {product.modelName}</p>}
            <p className="mt-3 text-sm leading-relaxed text-muted">{product.description}</p>
            {product.features.length > 0 && (
              <ul data-features className="mt-5 space-y-2 text-sm">
                {product.features.map((f) => (
                  <li key={f.title}>
                    <span className="font-semibold text-ink">{f.title}.</span> <span className="text-muted">{f.text}</span>
                  </li>
                ))}
              </ul>
            )}
            {product.dimensions.length > 0 && (
              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                {product.dimensions.map((d) => (
                  <div key={d.label} className="contents">
                    <dt className="text-muted">{d.label}</dt>
                    <dd className="font-medium">{d.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {product.seatOptions.length > 0 && (
              <p className="mt-5 text-sm"><span className="text-muted">Seat colours:</span> {product.seatOptions.join(", ")}</p>
            )}
            {product.seatNote && <p className="mt-2 text-xs text-muted">{product.seatNote}</p>}
          </div>
        </div>
      )}
    </dialog>
  );
}
