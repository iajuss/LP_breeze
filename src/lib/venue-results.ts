import type { Venue } from "@/types/content";

export type VenueFilters = {
  activity?: string;
  location?: string;
  zone?: string;
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

const matchesGuestCount = (venue: Pick<Venue, "capacity">, guests?: string) => {
  const requestedGuests = Number(guests);
  return !Number.isFinite(requestedGuests) || requestedGuests < 1 || venue.capacity >= requestedGuests;
};

/** Localizacao do espaco no mesmo formato das opcoes de busca: "Bairro, Cidade, SP". */
export function venueLocation(venue: Pick<Venue, "city" | "region">): string {
  return venue.region === venue.city ? `${venue.city}, SP` : `${venue.region}, ${venue.city}, SP`;
}

export function filterVenues(venues: Venue[], filters: VenueFilters): Venue[] {
  const activity = filters.activity;

  return venues.filter((venue) => (
    matchesText(venue.eventTypes.join(" "), activity)
    && matchesText(venueLocation(venue), filters.location)
    && matchesText(venue.zone, filters.zone)
    && matchesText(venue.styles.join(" "), filters.style)
    && matchesGuestCount(venue, filters.guests)
  ));
}

export function recommendVenues(venues: Venue[], filters: VenueFilters, limit = 3): Venue[] {
  return venues
    .map((venue, index) => {
      let score = 0;

      if (filters.activity && matchesText(venue.eventTypes.join(" "), filters.activity)) score += 4;
      if (filters.guests && matchesGuestCount(venue, filters.guests)) score += 3;
      if (filters.location && matchesText(venueLocation(venue), filters.location)) score += 2;
      if (filters.zone && matchesText(venue.zone, filters.zone)) score += 2;
      if (filters.style && matchesText(venue.styles.join(" "), filters.style)) score += 1;

      return { venue, index, score };
    })
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, limit)
    .map(({ venue }) => venue);
}
