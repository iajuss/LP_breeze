"use client";

import Link from "next/link";
import { useState } from "react";
import { stylePanels } from "@/data/home-interactions";

export function StyleExplorer() {
  const [activeStyleId, setActiveStyleId] = useState(stylePanels[0].id);
  const activeStyle = stylePanels.find((style) => style.id === activeStyleId) ?? stylePanels[0];

  return (
    <div className="mt-8 min-w-0">
      <div aria-label="Estilos de espaço" className="flex snap-x gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist">
        {stylePanels.map((style) => (
          <button
            aria-controls="painel-estilo"
            aria-selected={style.id === activeStyle.id}
            className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition focus-visible:outline-[var(--primary)] ${style.id === activeStyle.id ? "bg-[var(--primary)] text-white" : "bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-white"}`}
            key={style.id}
            onClick={() => setActiveStyleId(style.id)}
            role="tab"
            type="button"
          >
            {style.name}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl bg-[var(--foreground)] text-white md:grid md:grid-cols-[1.05fr_.95fr]" id="painel-estilo" role="tabpanel">
        <div
          aria-label={activeStyle.imageAlt}
          className="min-h-72 bg-cover bg-center md:min-h-[31rem]"
          role="img"
          style={{ backgroundImage: `linear-gradient(110deg, rgba(18,45,38,.05), rgba(18,45,38,.56)), url(${activeStyle.image})` }}
        />
        <div className="flex min-h-72 flex-col justify-between p-7 sm:p-10 lg:p-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/65">Clima do evento</p>
            <h3 className="mt-5 font-display text-4xl leading-none sm:text-5xl">{activeStyle.name}</h3>
            <p className="mt-5 text-lg leading-relaxed text-white/80">{activeStyle.description}</p>
          </div>
          <Link aria-label={`Explorar espaços com estilo ${activeStyle.name}`} className="mt-10 inline-flex min-h-11 w-fit items-center rounded-xl bg-white px-5 py-3 font-semibold text-[var(--primary)] hover:bg-[var(--secondary)]" href={`/buscar?style=${activeStyle.slug}`}>
            Explorar este estilo <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
