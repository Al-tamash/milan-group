import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { getCategory, getProduct, productImage, products, productsIn } from "@/lib/data";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductCard } from "@/components/ui";

type Params = { params: Promise<{ category: string; product: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ category: p.category, product: p.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category, product: slug } = await params;
  const product = getProduct(category, slug);
  if (!product) return {};
  return {
    title: `${product.name} on Rent`,
    description: `${product.name} — ${product.tagline}. ${product.description}`.slice(0, 160),
    openGraph: { images: [productImage(product.variants[0].images[0])] },
  };
}

export default async function ProductPage({ params }: Params) {
  const { category: cat, product: slug } = await params;
  const product = getProduct(cat, slug);
  const category = getCategory(cat);
  if (!product || !category) notFound();

  const related = productsIn(product.category).filter((p) => p.slug !== product.slug).slice(0, 4);

  return (
    <>
      <div className="border-b border-line bg-champagne/45">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 py-3 text-xs text-muted sm:px-6">
          <Link href="/" className="hover:text-emerald">Home</Link><span className="mx-2 text-gold">/</span>
          <Link href="/catalog/" className="hover:text-emerald">Catalog</Link><span className="mx-2 text-gold">/</span>
          <Link href={`/catalog/${category.slug}/`} className="hover:text-emerald">{category.name}</Link><span className="mx-2 text-gold">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <ProductDetail product={product} />
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3">
          <div>
            <h2 className="font-display text-3xl text-emerald">Features</h2>
            <dl className="mt-5 space-y-4">
              {product.features.map((f) => (
                <div key={f.title}>
                  <dt className="text-sm font-semibold">{f.title}</dt>
                  <dd className="text-sm text-muted">{f.text}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="font-display text-3xl text-emerald">Dimensions</h2>
            {product.dimensions.length ? (
              <table className="mt-5 w-full text-sm">
                <tbody>
                  {product.dimensions.map((d) => (
                    <tr key={d.label} className="border-b border-line">
                      <th scope="row" className="py-2.5 text-left font-medium">{d.label}</th>
                      <td className="py-2.5 text-right text-muted">{d.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="mt-5 text-sm text-muted">Exact measurements on request — ask us on WhatsApp.</p>
            )}
          </div>
          <div>
            <h2 className="font-display text-3xl text-emerald">Perfect for</h2>
            <ul className="mt-5 space-y-2.5">
              {product.suitedFor.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-gold-600" /> {s}</li>
              ))}
            </ul>
            {product.variants.length > 1 && (
              <>
                <h3 className="mt-7 text-sm font-semibold">Available colours</h3>
                <p className="mt-1 text-sm text-muted">{product.variants.map((v) => v.name).join(", ")}</p>
              </>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-4xl text-emerald">More {category.name.toLowerCase()}</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}
    </>
  );
}
