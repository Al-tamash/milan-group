"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Enquiry list (D17): lives only in the visitor's browser, sent as one WhatsApp message.
export type EnquiryItem = {
  key: string;
  /** "service" items (D38) have no quantity */
  kind?: "product" | "service";
  name: string;
  href: string;
  colour?: string;
  seat?: string;
  qty: number;
};

type EnquiryApi = {
  items: EnquiryItem[];
  count: number;
  add: (item: Omit<EnquiryItem, "key" | "qty">, qty?: number) => void;
  update: (key: string, patch: Partial<Pick<EnquiryItem, "qty" | "seat">>) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "milan-enquiry-v1";
const EnquiryCtx = createContext<EnquiryApi | null>(null);

const keyOf = (i: Pick<EnquiryItem, "name" | "colour" | "seat">) =>
  [i.name, i.colour ?? "", i.seat ?? ""].join("|");

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<EnquiryItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // Storage blocked (private mode etc.) — list just won't persist.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const add = useCallback<EnquiryApi["add"]>((item, qty = 1) => {
    setItems((prev) => {
      const key = keyOf(item);
      const existing = prev.find((i) => i.key === key);
      if (existing) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { ...item, key, qty }];
    });
  }, []);

  const update = useCallback<EnquiryApi["update"]>((key, patch) => {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  }, []);

  const remove = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, count: items.length, add, update, remove, clear }),
    [items, add, update, remove, clear],
  );
  return <EnquiryCtx.Provider value={value}>{children}</EnquiryCtx.Provider>;
}

export function useEnquiry() {
  const ctx = useContext(EnquiryCtx);
  if (!ctx) throw new Error("useEnquiry must be used inside EnquiryProvider");
  return ctx;
}
