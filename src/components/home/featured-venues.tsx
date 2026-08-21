import { venues } from "@/data/venues";
import { VenueCard } from "./venue-card";

export function FeaturedVenues() {
  return (
    <section className="w-full scroll-mt-28 py-16 sm:py-20 lg:flex lg:min-h-screen lg:items-center" id="espacos">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Arcora em São Paulo</p>
            <h2 className="mt-3 font-display text-4xl leading-[0.98] sm:text-5xl">Espaços que inspiram</h2>
          </div>
          <a className="hidden font-semibold text-[var(--primary)] sm:block" href="/buscar">Ver todos →</a>
        </div>
        <div className="flex w-full min-w-0 snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:overflow-visible">
          {venues.map((venue, index) => <div className="w-[82vw] max-w-[320px] shrink-0 snap-start sm:w-[340px] sm:max-w-none lg:w-auto lg:max-w-none lg:min-w-0" key={venue.id}><VenueCard featured={index === 0} venue={venue} /></div>)}
        </div>
      </div>
    </section>
  );
}
