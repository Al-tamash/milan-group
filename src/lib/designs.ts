// Pure helpers for the designs section on service pages. No "@/" imports so Node's test runner can load it directly.

export type DesignGroup = "designer-chairs" | "clear-chairs" | "wooden-chairs" | "sofas" | "tents";

export const GROUP_LABELS: Record<DesignGroup, string> = {
  "designer-chairs": "Designer & banquet chairs",
  "clear-chairs": "Clear / acrylic chairs",
  "wooden-chairs": "Wooden chairs",
  sofas: "Stage sofas",
  tents: "Tents",
};

export type DesignLike = {
  slug: string;
  name: string;
  modelName?: string;
  category: string;
  group: DesignGroup;
  variants: { name: string }[];
};

export function groupDesigns<T extends DesignLike>(items: T[], categories: string[]) {
  const wanted = items.filter((i) => categories.includes(i.category));
  return (Object.keys(GROUP_LABELS) as DesignGroup[])
    .map((group) => ({ group, label: GROUP_LABELS[group], items: wanted.filter((i) => i.group === group) }))
    .filter((g) => g.items.length > 0);
}

export function colourLine(item: DesignLike): string | null {
  if (item.variants.length <= 1) return null;
  return `${item.variants.length} colours: ${item.variants.map((v) => v.name).join(", ")}`;
}

export function messageName(item: DesignLike): string {
  return item.modelName ? `${item.name} (${item.modelName})` : item.name;
}

const DETAILS = "\nDate: \nVenue: \nGuests: ";

export function buildDesignsMessage(serviceName: string, selected: DesignLike[]): string {
  if (selected.length === 0) return `Hi Milan Group, I'd like to enquire about ${serviceName}.${DETAILS}`;
  return `Hi Milan Group, I liked these: ${selected.map(messageName).join(", ")}.${DETAILS}`;
}
