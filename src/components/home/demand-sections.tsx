import Link from "next/link";
import { faqs } from "@/data/faqs";
import { categoryRailItems, cityRailItems, editorialRailItems } from "@/data/home-interactions";
import { styles } from "@/data/styles";
import { trustItems } from "@/data/trust";
import { Faq } from "./faq";
import { HowItWorksCarousel } from "./how-it-works-carousel";
import { PhotoRail } from "./photo-rail";

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
            <div className="grid grid-cols-2 gap-3">
              {styles.map((style) => <Link className="rounded-2xl border border-[var(--border)] p-5 text-lg font-semibold hover:border-[var(--primary)]" href={`/buscar?style=${style.slug}`} key={style.id}>{style.name}<span className="ml-2 text-[var(--accent)]">↗</span></Link>)}
            </div>
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
          <div className="rounded-3xl bg-[var(--primary)] p-8 text-white lg:p-14">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/70">Para empresas</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[0.98] sm:text-5xl">Seu próximo evento corporativo começa pelo lugar certo.</h2>
            <p className="mt-5 max-w-xl text-white/80">Confraternizações, lançamentos, workshops, reuniões, treinamentos e experiências de marca começam por uma busca com contexto.</p>
            <Link className="mt-8 inline-flex min-h-11 items-center rounded-xl bg-white px-5 py-3 font-semibold text-[var(--primary)]" href="/buscar?activity=Evento+corporativo">Encontrar espaço para minha empresa</Link>
          </div>
        </div>
      </section>

      <section className="w-full border-y border-[var(--border)] bg-[var(--secondary)] py-16 lg:flex lg:min-h-screen lg:items-center">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Escolha com clareza</p>
          <div className="mt-7 grid gap-6 md:grid-cols-3">
            {trustItems.map((item) => <article key={item.id}><p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Demonstração</p><h3 className="mt-3 font-display text-3xl">{item.title}</h3><p className="mt-3 text-[var(--muted)]">{item.description}</p></article>)}
          </div>
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
