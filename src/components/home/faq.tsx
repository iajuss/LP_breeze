"use client";

import { useState } from "react";
import type { FaqItem } from "@/types/content";

export function Faq({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <button aria-controls={`faq-${item.id}`} aria-expanded={open} className="flex min-h-16 w-full items-center justify-between gap-4 py-4 text-left font-semibold" onClick={() => setOpenId(open ? null : item.id)} type="button">
              <span>{item.question}</span>
              <span aria-hidden="true">{open ? "−" : "+"}</span>
            </button>
            <div aria-hidden={!open} className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`} id={`faq-${item.id}`}>
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-5 text-[var(--muted)]">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
