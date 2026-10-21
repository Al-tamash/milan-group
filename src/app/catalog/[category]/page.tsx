import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory, productsIn } from "@/lib/data";
import { PageHero, ProductCard } from "@/components/ui";

type Params = { params: Promise<{ category: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => categories.map((c) => ({ category: c.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const category = getCategory((await params).category);
  return category ? { title: `${category.name} on Rent in Hyderabad`, description: category.blurb } : {};
}

export default async function CategoryPage({ params }: Params) {
  const category = getCategory((await params).category);
  if (!category) notFound();
  const items = productsIn(category.slug);

  return (
    <>
      <PageHero
        eyebrow={`${items.length} designs`}
        title={category.name}
        intro={category.blurb}
        crumbs={[{ href: "/", label: "Home" }, { href: "/catalog/", label: "Catalog" }, { href: `/catalog/${category.slug}/`, label: category.name }]}
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>
    </>
  );
}
