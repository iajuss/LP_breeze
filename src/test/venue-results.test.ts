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

    expect(results.map((venue) => venue.id)).toEqual(["casa-jardim"]);
  });

  it("normalizes singular occasion labels used by the search form", () => {
    const results = filterVenues(venues, { activity: "Evento corporativo" });

    expect(results.map((venue) => venue.id)).toEqual(["rooftop-lapa"]);
  });

  it("returns no exact result when the requested capacity exceeds every option", () => {
    expect(filterVenues(venues, { guests: "600" })).toEqual([]);
  });
});
