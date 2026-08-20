"use client";

import Link from "next/link";
import { useRef } from "react";
import type { PhotoRailItem } from "@/data/home-interactions";

type PhotoRailProps = {
  ariaLabel: string;
  items: PhotoRailItem[];
};

export function PhotoRail({ ariaLabel, items }: PhotoRailProps) {
  const railRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy?.({ behavior: "smooth", left: direction * Math.max(rail.clientWidth * 0.82, 280) });
  };

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-end gap-2">
        <button aria-label={`Voltar ${ariaLabel}`} className="grid size-11 place-items-center rounded-full border border-[var(--border)] bg-white text-lg text-[var(--foreground)] hover:border-[var(--primary)]" onClick={() => scroll(-1)} type="button">←</button>
        <button aria-label={`Avançar ${ariaLabel}`} className="grid size-11 place-items-center rounded-full bg-[var(--primary)] text-lg text-white hover:bg-[var(--foreground)]" onClick={() => scroll(1)} type="button">→</button>
      </div>
      <div aria-label={ariaLabel} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" ref={railRef} role="region">
        {items.map((item) => (
          <Link
            className="group relative flex min-h-80 min-w-[78vw] shrink-0 snap-start items-end overflow-hidden rounded-3xl bg-[var(--foreground)] p-5 text-white sm:min-w-80 lg:min-w-96"
            href={item.href}
            key={item.id}
            style={{ backgroundImage: `linear-gradient(0deg, rgba(18,45,38,.88), rgba(18,45,38,.08)), url(${item.image})`, backgroundPosition: "center", backgroundSize: "cover" }}
          >
            <span className="relative">
              <span className="block text-sm font-semibold uppercase tracking-[0.14em] text-white/75">{item.subtitle}</span>
              <span className="mt-2 block font-display text-3xl leading-none sm:text-4xl">{item.title}</span>
            </span>
            <span aria-hidden="true" className="absolute right-5 top-5 grid size-11 place-items-center rounded-full border border-white/50 bg-black/10 text-lg transition group-hover:bg-white group-hover:text-[var(--foreground)]">↗</span>
            <span aria-label={item.imageAlt} className="sr-only" role="img" />
          </Link>
        ))}
      </div>
    </div>
  );
}
