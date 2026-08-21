"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { PhotoRailItem } from "@/data/home-interactions";

type PhotoRailProps = {
  ariaLabel: string;
  items: PhotoRailItem[];
};

export function PhotoRail({ ariaLabel, items }: PhotoRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const normalizeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibleItems = [0, 1, 2].flatMap((copy) => items.map((item) => ({ ...item, copy })));

  const getLoopBounds = (rail: HTMLDivElement) => {
    const middleStart = rail.querySelector<HTMLElement>('[data-loop-copy="1"]')?.offsetLeft ?? 0;
    const finalStart = rail.querySelector<HTMLElement>('[data-loop-copy="2"]')?.offsetLeft ?? 0;
    return { loopWidth: finalStart - middleStart, middleStart };
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const { middleStart } = getLoopBounds(rail);
    if (middleStart) rail.scrollTo?.({ behavior: "auto", left: middleStart });
  }, [items.length]);

  useEffect(() => () => {
    if (normalizeTimeout.current) clearTimeout(normalizeTimeout.current);
  }, []);

  const scroll = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const { loopWidth, middleStart } = getLoopBounds(rail);
    const isInLeadingCopy = rail.scrollLeft < middleStart - 4;
    const isInTrailingCopy = rail.scrollLeft >= middleStart + loopWidth;
    if (loopWidth && ((direction === -1 && isInLeadingCopy) || (direction === 1 && isInTrailingCopy))) {
      rail.scrollTo?.({ behavior: "auto", left: rail.scrollLeft + (direction === -1 ? loopWidth : -loopWidth) });
    }
    rail.scrollBy?.({ behavior: "smooth", left: direction * Math.max(rail.clientWidth * 0.82, 280) });
  };

  const normalizeLoop = () => {
    const rail = railRef.current;
    if (!rail) return;
    if (normalizeTimeout.current) clearTimeout(normalizeTimeout.current);
    normalizeTimeout.current = setTimeout(() => {
      const { loopWidth, middleStart } = getLoopBounds(rail);
      if (!loopWidth) return;
      if (rail.scrollLeft < middleStart) rail.scrollTo?.({ behavior: "auto", left: rail.scrollLeft + loopWidth });
      if (rail.scrollLeft >= middleStart + loopWidth) rail.scrollTo?.({ behavior: "auto", left: rail.scrollLeft - loopWidth });
    }, 140);
  };

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-end gap-2">
        <button aria-label={`Voltar ${ariaLabel}`} className="grid size-11 place-items-center rounded-full bg-[var(--primary)] text-lg text-white hover:bg-[var(--foreground)]" onClick={() => scroll(-1)} type="button">←</button>
        <button aria-label={`Avançar ${ariaLabel}`} className="grid size-11 place-items-center rounded-full bg-[var(--primary)] text-lg text-white hover:bg-[var(--foreground)]" onClick={() => scroll(1)} type="button">→</button>
      </div>
      <div aria-label={ariaLabel} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" onScroll={normalizeLoop} ref={railRef} role="region">
        {visibleItems.map((item) => (
          <div aria-hidden={item.copy !== 1} className="contents" key={`${item.copy}-${item.id}`}>
            <Link
              aria-label={`${item.title} — ${item.imageAlt}`}
              className="group relative flex min-h-80 w-[78vw] shrink-0 snap-start items-end overflow-hidden rounded-3xl bg-[var(--foreground)] p-5 text-white sm:w-80 lg:w-96"
              data-loop-copy={item.copy}
              href={item.href}
              style={{ backgroundImage: `linear-gradient(0deg, rgba(18,45,38,.88), rgba(18,45,38,.08)), url(${item.image})`, backgroundPosition: "center", backgroundSize: "cover" }}
              tabIndex={item.copy === 1 ? undefined : -1}
            >
              <span className="relative">
                <span className="block text-sm font-semibold uppercase tracking-[0.14em] text-white/75">{item.subtitle}</span>
                <span className="mt-2 block font-display text-3xl leading-none sm:text-4xl">{item.title}</span>
              </span>
              <span aria-hidden="true" className="absolute right-5 top-5 grid size-11 place-items-center rounded-full border border-white/50 bg-black/10 text-lg transition group-hover:bg-white group-hover:text-[var(--foreground)]">↗</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
