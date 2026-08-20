"use client";

import { useRef, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Descubra",
    description: "Conte o que você está planejando e encontre possibilidades que combinam com a sua ocasião.",
    image: "1507504031003-b417219a0fde",
    alt: "Ambiente preparado para receber um evento",
  },
  {
    number: "02",
    title: "Compare",
    description: "Veja fotos, capacidade e características dos espaços para decidir com calma e confiança.",
    image: "1497366811353-6870744d04b2",
    alt: "Espaço para evento corporativo com mesas e cadeiras",
  },
  {
    number: "03",
    title: "Converse",
    description: "Inicie a conversa sobre disponibilidade e condições diretamente com quem conhece cada espaço.",
    image: "1519167758481-83f550bb49b3",
    alt: "Mesa posta para uma celebração",
  },
];

export function HowItWorksCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStart = useRef<number | null>(null);
  const activeStep = steps[activeIndex];

  const selectStep = (index: number) => setActiveIndex((index + steps.length) % steps.length);
  const previousStep = () => selectStep(activeIndex - 1);
  const nextStep = () => selectStep(activeIndex + 1);

  return (
    <div
      aria-label="Como funciona"
      aria-roledescription="carrossel"
      className="mt-8"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") previousStep();
        if (event.key === "ArrowRight") nextStep();
      }}
      onPointerDown={(event) => { pointerStart.current = event.clientX; }}
      onPointerUp={(event) => {
        if (pointerStart.current === null) return;
        const distance = event.clientX - pointerStart.current;
        pointerStart.current = null;
        if (Math.abs(distance) < 48) return;
        if (distance > 0) previousStep(); else nextStep();
      }}
      role="region"
      tabIndex={0}
    >
      <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-2xl shadow-black/15">
        <div className="grid min-h-[31rem] md:grid-cols-[1.02fr_.98fr]">
          <div
            aria-label={activeStep.alt}
            className="min-h-60 bg-cover bg-center md:min-h-full"
            role="img"
            style={{ backgroundImage: `linear-gradient(120deg, rgba(18,45,38,.24), rgba(18,45,38,.68)), url(https://images.unsplash.com/photo-${activeStep.image}?auto=format&fit=crop&w=1200&q=85)` }}
          />
          <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-14">
            <div>
              <div className="flex items-center justify-between gap-5">
                <span className="font-display text-6xl leading-none text-[var(--accent)] sm:text-7xl">{activeStep.number}</span>
                <span aria-live="polite" className="text-sm font-semibold uppercase tracking-[0.16em] text-white/65">Etapa {activeIndex + 1} de {steps.length}</span>
              </div>
              <h3 className="mt-8 font-display text-4xl leading-none sm:text-5xl">{activeStep.title}</h3>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-white/78">{activeStep.description}</p>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
              <div aria-label="Escolha uma etapa" className="flex items-center gap-2" role="tablist">
                {steps.map((step, index) => (
                  <button
                    aria-controls="como-funciona-painel"
                    aria-selected={index === activeIndex}
                    className={`min-h-11 rounded-full px-4 text-sm font-semibold transition focus-visible:outline-white ${index === activeIndex ? "bg-[var(--accent)] text-[var(--foreground)]" : "bg-white/10 text-white hover:bg-white/20"}`}
                    key={step.number}
                    onClick={() => selectStep(index)}
                    role="tab"
                    type="button"
                  >
                    {step.number}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button aria-label="Etapa anterior" className="grid size-11 place-items-center rounded-full border border-white/35 text-xl transition hover:bg-white hover:text-[var(--foreground)] focus-visible:outline-white" onClick={previousStep} type="button">←</button>
                <button aria-label="Próxima etapa" className="grid size-11 place-items-center rounded-full border border-white/35 text-xl transition hover:bg-white hover:text-[var(--foreground)] focus-visible:outline-white" onClick={nextStep} type="button">→</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="mt-4 flex gap-2">
        {steps.map((step, index) => <span className={`h-1 rounded-full transition-all ${index === activeIndex ? "w-12 bg-[var(--accent)]" : "w-5 bg-white/25"}`} key={step.number} />)}
      </div>
      <p className="mt-4 text-sm text-white/60">Use as setas ou deslize para acompanhar cada etapa.</p>
    </div>
  );
}
