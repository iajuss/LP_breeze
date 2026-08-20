import { faqs } from "@/data/faqs";
import { categoryRailItems, cityRailItems, editorialRailItems } from "@/data/home-interactions";
import { Faq } from "./faq";
import { CorporateShowcase } from "./corporate-showcase";
import { HowItWorksCarousel } from "./how-it-works-carousel";
import { PhotoRail } from "./photo-rail";
import { StyleExplorer } from "./style-explorer";
import { TrustTimeline } from "./trust-timeline";

export function DemandSections() {
  return (
    <>
      <section className="w-full bg-[var(--secondary)] py-16 sm:py-20 lg:flex lg:min-h-screen lg:items-center">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Por ocasião</p>
          <h2 className="mt-3 font-display text-4xl leading-[0.98] sm:text-5xl">Encontre um espaço para cada ocasião</h2>
          <PhotoRail ariaLabel="Ocasiões" items={categoryRailItems} />
        </div>
      </section>

      <section className="w-full py-16 sm:py-20 lg:flex lg:min-h-screen lg:items-center">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Explore por estilo</p>
              <h2 className="mt-3 font-display text-4xl leading-[0.98] sm:text-5xl">Qual é o clima do seu evento?</h2>
              <p className="mt-5 max-w-md text-[var(--muted)]">A arquitetura, a luz e a atmosfera também fazem parte da experiência.</p>
            </div>
            <StyleExplorer />
          </div>
        </div>
      </section>

      <section className="w-full scroll-mt-28 bg-[var(--foreground)] py-16 text-white sm:py-20 lg:flex lg:min-h-screen lg:items-center" id="como-funciona">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/70">Como funciona</p>
          <HowItWorksCarousel />
        </div>
      </section>

      <section className="w-full scroll-mt-28 py-16 sm:py-20 lg:flex lg:min-h-screen lg:items-center" id="empresas">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
          <CorporateShowcase />
        </div>
      </section>

      <section className="w-full border-y border-[var(--border)] bg-[var(--secondary)] py-16 lg:flex lg:min-h-screen lg:items-center">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Escolha com clareza</p>
          <TrustTimeline />
        </div>
      </section>

      <section className="w-full py-16 sm:py-20 lg:flex lg:min-h-screen lg:items-center">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Onde procurar</p>
          <h2 className="mt-3 font-display text-4xl leading-[0.98] sm:text-5xl">Explore espaços nas principais cidades</h2>
          <PhotoRail ariaLabel="Cidades" items={cityRailItems} />
        </div>
      </section>

      <section className="w-full bg-[var(--secondary)] py-16 sm:py-20 lg:flex lg:min-h-screen lg:items-center">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Guia Breeze</p>
          <h2 className="mt-3 font-display text-4xl leading-[0.98] sm:text-5xl">Ideias para tornar seu evento extraordinário</h2>
          <PhotoRail ariaLabel="Guias Breeze" items={editorialRailItems} />
        </div>
      </section>

      <section className="w-full py-16 sm:py-20 lg:flex lg:min-h-screen lg:items-center">
        <div className="mx-auto w-full max-w-3xl px-5">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Dúvidas frequentes</p>
          <h2 className="mt-3 text-center font-display text-4xl leading-[0.98] sm:text-5xl">Antes de começar</h2>
          <div className="mt-10"><Faq items={faqs} /></div>
        </div>
      </section>
    </>
  );
}
