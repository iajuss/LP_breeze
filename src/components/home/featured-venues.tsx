import { venues } from "@/data/venues";
import { VenueCard } from "./venue-card";

export function FeaturedVenues() {
  return (
    <section className="w-full py-20" id="espacos">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Seleção Breeze</p>
            <h2 className="mt-3 font-display text-5xl">Espaços que inspiram</h2>
          </div>
          <a className="hidden font-semibold text-[var(--primary)] sm:block" href="/buscar">Ver todos →</a>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-3 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {venues.map((venue, index) => <div className="min-w-[82vw] sm:min-w-[340px] lg:min-w-0" key={venue.id}><VenueCard featured={index === 0} venue={venue} /></div>)}
        </div>
      </div>
    </section>
  );
}
