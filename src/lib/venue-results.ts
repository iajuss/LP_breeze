import type { Venue } from "@/types/content";

export type VenueFilters = {
  activity?: string;
  location?: string;
  guests?: string;
  style?: string;
};

const normalize = (value: string) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase("pt-BR")
  .replace(/[^a-z0-9]+/g, " ")
  .replace(/s\b/g, "")
  .trim();

const matchesText = (source: string, query?: string) => {
  if (!query?.trim()) return true;
  const normalizedSource = normalize(source);
  return normalize(query).split(/\s+/).every((term) => normalizedSource.includes(term));
};

const activityAliases: Record<string, string> = {
  Ensaio: "Produção",
  Ensaios: "Produção",
  Lançamento: "Evento corporativo",
  Lançamentos: "Evento corporativo",
  Produções: "Produção",
};

/** Localizacao do espaco no mesmo formato das opcoes de busca: "Bairro, Cidade, SP". */
export function venueLocation(venue: Pick<Venue, "city" | "region">): string {
  return venue.region === venue.city ? `${venue.city}, SP` : `${venue.region}, ${venue.city}, SP`;
}

export function filterVenues(venues: Venue[], filters: VenueFilters): Venue[] {
  const requestedGuests = Number(filters.guests);
  const activity = filters.activity ? activityAliases[filters.activity] ?? filters.activity : undefined;

  return venues.filter((venue) => (
    matchesText(venue.category, activity)
    && matchesText(venueLocation(venue), filters.location)
    && matchesText(venue.styles.join(" "), filters.style)
    && (!Number.isFinite(requestedGuests) || requestedGuests < 1 || venue.capacity >= requestedGuests)
  ));
}
