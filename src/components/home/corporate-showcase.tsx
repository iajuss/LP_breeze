"use client";

import Link from "next/link";
import { useState } from "react";
import { corporateScenarios } from "@/data/home-interactions";
import { track } from "@/lib/analytics";

export function CorporateShowcase() {
  const [activeScenarioId, setActiveScenarioId] = useState(corporateScenarios[0].id);
  const activeScenario = corporateScenarios.find((scenario) => scenario.id === activeScenarioId) ?? corporateScenarios[0];

  return (
    <div className="overflow-hidden rounded-3xl bg-[var(--primary)] text-white lg:grid lg:grid-cols-[.94fr_1.06fr]">
      <div className="flex min-h-[30rem] flex-col justify-between p-8 sm:p-10 lg:p-14">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/70">Para empresas</p>
          <h2 className="mt-5 max-w-xl font-display text-4xl leading-[0.98] sm:text-5xl">{activeScenario.headline}</h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{activeScenario.description}</p>
        </div>

        <div className="mt-10">
          <div aria-label="Cenários corporativos" className="flex flex-wrap gap-2" role="group">
            {corporateScenarios.map((scenario) => (
              <button
                aria-pressed={scenario.id === activeScenario.id}
                className={`min-h-11 rounded-full px-4 text-sm font-semibold transition focus-visible:outline-white ${scenario.id === activeScenario.id ? "bg-white text-[var(--primary)]" : "bg-white/15 text-white hover:bg-white/25"}`}
                key={scenario.id}
                onClick={() => setActiveScenarioId(scenario.id)}
                type="button"
              >
                {scenario.label}
              </button>
            ))}
          </div>
          <Link className="mt-6 inline-flex min-h-11 w-[22rem] max-w-full items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-[var(--primary)] hover:bg-[var(--secondary)]" href="/buscar?activity=Evento+corporativo" onClick={() => track("corporate_cta_clicked", { scenario: activeScenario.id })}>
            Encontrar espaço para minha empresa
          </Link>
        </div>
      </div>
      <div
        aria-label={activeScenario.imageAlt}
        className="min-h-80 bg-cover bg-center lg:min-h-full"
        role="img"
        style={{ backgroundImage: `linear-gradient(110deg, rgba(23,76,67,.12), rgba(23,76,67,.62)), url(${activeScenario.image})` }}
      />
    </div>
  );
}
