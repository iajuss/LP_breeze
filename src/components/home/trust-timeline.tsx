"use client";

import { useState } from "react";
import { trustTimelineItems } from "@/data/home-interactions";

export function TrustTimeline() {
  const [activeItemId, setActiveItemId] = useState(trustTimelineItems[0].id);
  const activeItem = trustTimelineItems.find((item) => item.id === activeItemId) ?? trustTimelineItems[0];

  return (
    <div className="mt-8">
      <div aria-label="Critérios para escolher com clareza" className="relative flex snap-x gap-3 overflow-x-auto pb-3 [scrollbar-width:none] md:justify-between [&::-webkit-scrollbar]:hidden" role="group">
        <div aria-hidden="true" className="absolute left-8 right-8 top-6 hidden h-px bg-[var(--border)] md:block" />
        {trustTimelineItems.map((item) => (
          <button
            aria-pressed={item.id === activeItem.id}
            className="relative z-10 flex min-h-14 shrink-0 items-center gap-3 rounded-full bg-[var(--background)] pr-4 text-left transition focus-visible:outline-[var(--primary)] md:bg-transparent md:pr-0"
            key={item.id}
            onClick={() => setActiveItemId(item.id)}
            type="button"
          >
            <span className={`grid size-12 place-items-center rounded-full border text-sm font-semibold transition ${item.id === activeItem.id ? "border-[var(--primary)] bg-[var(--primary)] text-white" : "border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[var(--primary)]"}`}>{item.number}</span>
            <span className="font-semibold md:max-w-36">{item.title}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-[var(--border)] bg-white md:grid md:grid-cols-[.95fr_1.05fr]">
        <div
          aria-label={activeItem.imageAlt}
          className="min-h-64 bg-cover bg-center md:min-h-[25rem]"
          role="img"
          style={{ backgroundImage: `linear-gradient(115deg, rgba(18,45,38,.08), rgba(18,45,38,.5)), url(${activeItem.image})` }}
        />
        <article className="flex min-h-64 flex-col justify-center p-7 sm:p-10 lg:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Demonstração</p>
          <h3 className="mt-4 font-display text-4xl leading-none sm:text-5xl">{activeItem.title}</h3>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--muted)]">{activeItem.description}</p>
        </article>
      </div>
    </div>
  );
}
