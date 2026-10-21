"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, MessageCircle, Minus, Plus } from "lucide-react";
import { productHref, productImage, whatsappLink, type Product } from "@/lib/data";
import { useEnquiry } from "./enquiry/EnquiryContext";
import { track } from "@/lib/analytics";

// Gallery + colour switcher (D14) + Add to Enquiry (D17), for one product page.
export function ProductDetail({ product }: { product: Product }) {
  const [variantIdx, setVariantIdx] = useState(0);
  const [imageIdx, setImageIdx] = useState(0);
  const [seat, setSeat] = useState(product.seatOptions[0] ?? "");
  const [qty, setQty] = useState(product.category === "chairs" ? 50 : 1);
  const [added, setAdded] = useState(false);
  const { add } = useEnquiry();

  const variant = product.variants[variantIdx];
  const image = variant.images[Math.min(imageIdx, variant.images.length - 1)];
  const colour = product.variants.length > 1 || product.category !== "tents" ? variant.name : undefined;

  const pickVariant = (i: number) => {
    setVariantIdx(i);
    setImageIdx(0);
  };

  const addToEnquiry = () => {
    add({ name: product.name, href: productHref(product), colour, seat: seat || undefined }, qty);
    track("add_to_enquiry", { product: product.slug, colour, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const directMessage = [
    `Hi Milan Group, I'm interested in the *${product.name}*`,
    colour && `Colour: ${colour}`,
    seat && `Seat: ${seat}`,
    `Quantity: ${qty}`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-[#f6f1e7]">
          <Image
            key={image}
            src={productImage(image)}
            alt={`${product.name} – ${variant.name}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-4"
          />
        </div>
        {variant.images.length > 1 && (
          <div className="mt-3 flex gap-3">
            {variant.images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setImageIdx(i)}
                aria-label={`View image ${i + 1}`}
                className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 bg-[#f6f1e7] ${
                  i === imageIdx ? "border-gold" : "border-transparent"
                }`}
              >
                <Image src={productImage(img)} alt="" fill sizes="80px" className="object-contain p-1" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="eyebrow">{product.category}</p>
        <h1 className="font-display mt-2 text-4xl leading-tight text-emerald sm:text-5xl">{product.name}</h1>
        {product.modelName && <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">Model: {product.modelName}</p>}
        <p className="mt-4 leading-relaxed text-muted">{product.description}</p>

        {product.variants.length > 1 && (
          <fieldset className="mt-7">
            <legend className="text-sm font-semibold">
              Frame colour: <span className="font-normal text-muted">{variant.name}</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {product.variants.map((v, i) => (
                <button
                  key={v.name}
                  type="button"
                  onClick={() => pickVariant(i)}
                  title={v.name}
                  aria-label={v.name}
                  aria-pressed={i === variantIdx}
                  className={`h-9 w-9 rounded-full border-2 ring-offset-2 ring-offset-ivory transition ${
                    i === variantIdx ? "border-white ring-2 ring-gold" : "border-black/10 hover:ring-2 hover:ring-line"
                  }`}
                  style={{ background: v.swatch }}
                />
              ))}
            </div>
          </fieldset>
        )}

        {product.seatOptions.length > 0 && (
          <div className="mt-6">
            <label htmlFor="seat" className="text-sm font-semibold">Seat / upholstery</label>
            <select
              id="seat"
              value={seat}
              onChange={(e) => setSeat(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
            >
              {product.seatOptions.map((s) => <option key={s}>{s}</option>)}
            </select>
            {product.seatNote && <p className="mt-2 text-xs text-muted">{product.seatNote}</p>}
          </div>
        )}

        <div className="mt-6">
          <span className="text-sm font-semibold">Quantity</span>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-line bg-white">
              <button type="button" aria-label="Decrease quantity" className="p-2.5" onClick={() => setQty((q) => Math.max(1, q - (q > 10 ? 10 : 1)))}>
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                className="w-16 bg-transparent text-center text-sm font-semibold [appearance:textfield]"
                aria-label="Quantity"
              />
              <button type="button" aria-label="Increase quantity" className="p-2.5" onClick={() => setQty((q) => q + (q >= 10 ? 10 : 1))}>
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={addToEnquiry}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald px-6 py-3 text-sm font-semibold text-ivory hover:bg-emerald-700"
          >
            {added ? <><Check className="h-4 w-4" /> Added to enquiry</> : <><Plus className="h-4 w-4" /> Add to enquiry</>}
          </button>
          <a
            href={whatsappLink(directMessage)}
            target="_blank"
            rel="noopener"
            onClick={() => track("whatsapp_click", { location: "product", product: product.slug })}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-white hover:brightness-110"
          >
            <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
          </a>
        </div>
        {added && (
          <p className="mt-3 text-sm text-emerald">
            Added. <Link href="/enquiry/" className="font-semibold underline decoration-gold underline-offset-4">View your enquiry list →</Link>
          </p>
        )}
        <p className="mt-4 text-xs text-muted">No online payment. We confirm availability and share a quote on WhatsApp.</p>
      </div>
    </div>
  );
}
