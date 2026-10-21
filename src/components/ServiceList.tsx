import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getService, products } from "@/lib/data";
import { ServiceIcon } from "./ui";

// Ten services read better as three short lists than as ten identical cards.
const GROUPS = [
  { name: "Set-up", slugs: ["tents-and-roofing", "furniture-and-seating", "lighting-and-electrical", "sound-and-dj"] },
  { name: "Décor & flowers", slugs: ["wedding-flower-work", "calcutta-decoration", "theme-functions", "flower-garlands-and-jewellery"] },
  { name: "Supplies", slugs: ["catering-and-kitchen", "season-articles"] },
];

const count = (categories: string[]) => products.filter((p) => categories.includes(p.category)).length;
const EXTRA: Record<string, string> = {
  "furniture-and-seating": `${count(["chairs", "sofas"])} chair & sofa designs`,
  "tents-and-roofing": `${count(["tents"])} tent types`,
};

export function ServiceList({ withCounts = true, headingAs: Heading = "h3" }: { withCounts?: boolean; headingAs?: "h2" | "h3" }) {
  return (
    <div className="grid gap-x-12 gap-y-10 lg:grid-cols-3">
      {GROUPS.map((g) => (
        <div key={g.name}>
          <Heading className="border-b border-line pb-3 text-sm font-semibold text-ink">{g.name}</Heading>
          <ul>
            {g.slugs.map(getService).filter((s) => s !== undefined).map((s) => (
              <li key={s.slug} className="border-b border-line/70">
                <Link href={`/services/${s.slug}/`} className="group flex gap-4 py-4">
                  <ServiceIcon name={s.icon} className="mt-1 h-5 w-5 shrink-0 text-gold-700" />
                  <span className="min-w-0 flex-1">
                    <span className="font-display flex items-center gap-2 text-2xl leading-tight text-emerald">
                      {s.name}
                      <ArrowRight className="h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{s.summary}</span>
                    {withCounts && EXTRA[s.slug] && (
                      <span className="mt-1.5 block text-xs font-semibold text-gold-700">{EXTRA[s.slug]}</span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
