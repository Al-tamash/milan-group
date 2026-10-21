"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageCircle, Trash2 } from "lucide-react";
import { useEnquiry } from "./EnquiryContext";
import { site, whatsappLink } from "@/lib/data";
import { track } from "@/lib/analytics";

const EVENT_TYPES = ["Wedding", "Reception", "Engagement", "Nikah", "Haldi / Mehendi", "Birthday", "Get-together", "Inauguration", "Corporate event", "Other"];

// Enquiry fields (D20): name, date, venue required; guests, type, notes optional.
export function EnquiryForm() {
  const { items, update, remove, clear } = useEnquiry();
  const [form, setForm] = useState({ name: "", date: "", venue: "", guests: "", type: "", notes: "" });
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const buildMessage = () => {
    const lines: (string | null)[] = [
      "Hi Milan Group, I'd like a quote for my event.",
      "",
      `*Name:* ${form.name}`,
      `*Event date:* ${form.date}`,
      `*Venue / area:* ${form.venue}`,
      form.type ? `*Event type:* ${form.type}` : null,
      form.guests ? `*Guests:* ${form.guests}` : null,
    ];
    if (items.length) {
      lines.push("", "*Items:*");
      items.forEach((i, n) =>
        lines.push(
          i.kind === "service"
            ? `${n + 1}. ${i.name} (service)`
            : `${n + 1}. ${i.name}${i.colour ? ` – ${i.colour}` : ""}${i.seat ? `, seat: ${i.seat}` : ""} × ${i.qty}`,
        ),
      );
    }
    if (form.notes) lines.push("", `*Notes:* ${form.notes}`);
    return lines.filter((l) => l !== null).join("\n");
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.date || !form.venue.trim()) {
      setError("Please fill in your name, event date and venue.");
      return;
    }
    setError("");
    track("send_enquiry", { items: items.length });
    window.open(whatsappLink(buildMessage()), "_blank", "noopener");
  };

  const field = "mt-1.5 block w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm";

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
      <section>
        <h2 className="font-display text-3xl text-emerald">Your items</h2>
        {items.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-line bg-white p-8 text-center">
            <p className="text-muted">Your enquiry list is empty.</p>
            <Link href="/catalog/" className="mt-3 inline-block font-semibold text-emerald underline decoration-gold underline-offset-4">
              Browse the catalog
            </Link>
            <p className="mt-3 text-xs text-muted">You can also send an enquiry without items — just describe what you need in the notes.</p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white">
            {items.map((i) => (
              <li key={i.key} className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <Link href={i.href} className="font-semibold text-emerald hover:underline">{i.name}</Link>
                  <p className="text-xs text-muted">
                    {i.kind === "service"
                      ? "Service — we'll discuss details on WhatsApp"
                      : [i.colour, i.seat && `Seat: ${i.seat}`].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
                {i.kind !== "service" && (
                  <input
                    type="number"
                    min={1}
                    value={i.qty}
                    onChange={(e) => update(i.key, { qty: Math.max(1, Number(e.target.value) || 1) })}
                    aria-label={`Quantity for ${i.name}`}
                    className="w-20 rounded-lg border border-line px-2 py-1.5 text-center text-sm"
                  />
                )}
                <button type="button" onClick={() => remove(i.key)} aria-label={`Remove ${i.name}`} className="p-2 text-muted hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {items.length > 0 && (
          <button type="button" onClick={clear} className="mt-3 text-xs text-muted underline">Clear list</button>
        )}
      </section>

      <form onSubmit={send} className="rounded-2xl border border-line bg-white p-6 shadow-sm" noValidate>
        <h2 className="font-display text-3xl text-emerald">Event details</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium sm:col-span-2">
            Your name *
            <input required value={form.name} onChange={set("name")} className={field} autoComplete="name" />
          </label>
          <label className="text-sm font-medium">
            Event date *
            <input required type="date" value={form.date} onChange={set("date")} className={field} />
          </label>
          <label className="text-sm font-medium">
            Venue / area *
            <input required value={form.venue} onChange={set("venue")} placeholder="e.g. Banjara Hills" className={field} />
          </label>
          <label className="text-sm font-medium">
            Event type
            <select value={form.type} onChange={set("type")} className={field}>
              <option value="">Select…</option>
              {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium">
            Guest count
            <input type="number" min={1} value={form.guests} onChange={set("guests")} className={field} />
          </label>
          <label className="text-sm font-medium sm:col-span-2">
            Notes
            <textarea rows={3} value={form.notes} onChange={set("notes")} placeholder="Tent, sound, lighting, flowers…" className={field} />
          </label>
        </div>
        {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
        <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 text-sm font-semibold text-white hover:brightness-110">
          <MessageCircle className="h-4 w-4" /> Send enquiry on WhatsApp
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          Opens WhatsApp with your details filled in, addressed to Milan Group (+{site.enquiryWhatsApp}). Nothing is stored on our servers.
        </p>
      </form>
    </div>
  );
}
