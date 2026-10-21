"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useEnquiry } from "./EnquiryContext";
import { track } from "@/lib/analytics";

// Adds a whole service to the enquiry list (D38).
export function AddServiceButton({ slug, name, tone = "light" }: { slug: string; name: string; tone?: "light" | "dark" }) {
  const { add, items } = useEnquiry();
  const [justAdded, setJustAdded] = useState(false);
  const inList = items.some((i) => i.kind === "service" && i.name === name);

  const onClick = () => {
    if (!inList) add({ kind: "service", name, href: `/services/${slug}/` });
    track("add_to_enquiry", { service: slug });
    setJustAdded(true);
  };

  if (inList && justAdded) {
    return (
      <Link
        href="/enquiry/"
        className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${
          tone === "dark" ? "bg-ivory text-emerald" : "bg-emerald text-ivory"
        }`}
      >
        <Check className="h-4 w-4" /> Added — view enquiry
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors ${
        tone === "dark"
          ? "border-ivory/70 text-ivory hover:bg-ivory hover:text-emerald"
          : "border-emerald text-emerald hover:bg-emerald hover:text-ivory"
      }`}
    >
      {inList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {inList ? "In your enquiry" : "Add to enquiry"}
    </button>
  );
}
