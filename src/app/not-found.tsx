import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-28 text-center">
      <h1 className="font-display text-5xl text-emerald">Page not found</h1>
      <p className="mt-4 text-muted">The page you are looking for has moved or does not exist.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="rounded-full bg-emerald px-6 py-3 text-sm font-semibold text-ivory">Go home</Link>
        <Link href="/services/" className="rounded-full border border-emerald px-6 py-3 text-sm font-semibold text-emerald">See our services</Link>
      </div>
    </section>
  );
}
