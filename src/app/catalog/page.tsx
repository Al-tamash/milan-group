import type { Metadata } from "next";
import Link from "next/link";
import { categories, productsIn } from "@/lib/data";
import { PageHero, ProductCard } from "@/components/ui";

export const metadata: Metadata = {
  title: "Rental Catalog – Chairs, Sofas & Tents",
  description: "Browse Milan Group's event rental catalog: designer chairs, stage sofas, pagoda and German hanger tents, with colours and sizes.",
};

export default function CatalogPage() {
  return (
    <>
      <PageHero
        eyebrow="Rental catalog"
        title="Chairs, sofas & tents"
        intro="Every design with photos, colours and sizes. Add what you like to your enquiry list and send it to us in one WhatsApp message."
        crumbs={[{ href: "/", label: "Home" }, { href: "/catalog/", label: "Catalog" }]}
      />
      <div className="sticky top-[65px] z-30 border-b border-line bg-ivory/95 backdrop-blur sm:top-[93px]">
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6" aria-label="Categories">
          {categories.map((c) => (
            <a key={c.slug} href={`#${c.slug}`} className="whitespace-nowrap rounded-full border border-line bg-white px-4 py-1.5 text-sm hover:border-gold">
              {c.name} <span className="text-muted">({productsIn(c.slug).length})</span>
            </a>
          ))}
        </nav>
      </div>
      {categories.map((c) => (
        <section key={c.slug} id={c.slug} className="mx-auto max-w-7xl scroll-mt-40 px-4 py-14 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-4xl text-emerald">{c.name}</h2>
              <p className="mt-1 text-sm text-muted">{c.blurb}</p>
            </div>
            <Link href={`/catalog/${c.slug}/`} className="shrink-0 text-sm font-semibold text-emerald hover:text-gold-600">Open {c.name.toLowerCase()} →</Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {productsIn(c.slug).map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      ))}
    </>
  );
}
