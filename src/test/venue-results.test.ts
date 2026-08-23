import { describe, expect, it } from "vitest";
import { venues } from "@/data/venues";
import { filterVenues } from "@/lib/venue-results";

describe("filterVenues", () => {
  it("combines occasion, location and guest filters into coherent results", () => {
    const results = filterVenues(venues, {
      activity: "Festa",
      location: "São Paulo, Pinheiros",
      guests: "80",
    });

    expect(results.map((venue) => venue.id)).toEqual(["casa-jardim-pinheiros"]);
  });

  it("normalizes singular occasion labels used by the search form", () => {
    const results = filterVenues(venues, { activity: "Evento corporativo" });

    expect(results.map((venue) => venue.id)).toEqual(["terraco-vila-madalena", "galeria-tatuape"]);
  });

  it("maps a lançamento to the corporate venues through the alias table", () => {
    expect(filterVenues(venues, { activity: "Lançamento" }).map((venue) => venue.id))
      .toEqual(filterVenues(venues, { activity: "Evento corporativo" }).map((venue) => venue.id));
  });

  it("keeps the region preference out of the result set", () => {
    expect(filterVenues(venues, { regionInterest: "Norte" } as never)).toHaveLength(venues.length);
  });

  it("returns no exact result when the requested capacity exceeds every option", () => {
    expect(filterVenues(venues, { guests: "5000" })).toEqual([]);
  });
});
