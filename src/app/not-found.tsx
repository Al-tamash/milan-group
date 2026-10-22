import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-28 text-center">
      <h1 className="font-display text-5xl text-emerald">Page not found</h1>
      <p className="mt-4 text-muted">This page has moved or doesn&rsquo;t exist. Try the services list, or call us.</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/services/" className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald px-6 py-3 text-sm font-semibold text-ivory hover:bg-emerald-700">See our services</Link>
        <Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-full border border-emerald px-6 py-3 text-sm font-semibold text-emerald hover:bg-emerald hover:text-ivory">Go to the home page</Link>
      </div>
    </section>
  );
}
