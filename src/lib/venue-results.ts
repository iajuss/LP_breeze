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
  Lançamento: "Evento corporativo",
};

export function filterVenues(venues: Venue[], filters: VenueFilters): Venue[] {
  const requestedGuests = Number(filters.guests);
  const activity = filters.activity ? activityAliases[filters.activity] ?? filters.activity : undefined;

  return venues.filter((venue) => (
    matchesText(venue.category, activity)
    && matchesText(`${venue.city} ${venue.region}`, filters.location)
    && matchesText(venue.styles.join(" "), filters.style)
    && (!Number.isFinite(requestedGuests) || requestedGuests < 1 || venue.capacity >= requestedGuests)
  ));
}
