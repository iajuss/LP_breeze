import { describe, expect, it } from "vitest";
import { activityOptions } from "@/data/search-options";
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

  it("finds the Pinheiros venue for a wedding even though Festa is its primary label", () => {
    expect(filterVenues(venues, { activity: "Casamento", location: "Pinheiros, São Paulo, SP" })
      .map((venue) => venue.slug)).toContain("casa-jardim-pinheiros");
  });

  it("keeps every selectable activity backed by at least one venue", () => {
    activityOptions.forEach((activity) => {
      expect(filterVenues(venues, { activity })).not.toEqual([]);
    });
  });

  it("exposes the twenty illustrative spaces with more than one occasion where configured", () => {
    expect(venues).toHaveLength(20);
    expect(venues.filter((venue) => venue.eventTypes.length > 1)).not.toEqual([]);
  });

  it("returns venues configured for the requested corporate occasion", () => {
    const results = filterVenues(venues, { activity: "Evento corporativo" });

    expect(results.map((venue) => venue.id)).toContain("terraco-vila-madalena");
  });

  it("returns venues explicitly configured for a lançamento", () => {
    expect(filterVenues(venues, { activity: "Lançamento" }).map((venue) => venue.id))
      .toContain("terraco-vila-madalena");
  });

  it("keeps the region preference out of the result set", () => {
    expect(filterVenues(venues, { regionInterest: "Norte" } as never)).toHaveLength(venues.length);
  });

  it("returns no exact result when the requested capacity exceeds every option", () => {
    expect(filterVenues(venues, { guests: "5000" })).toEqual([]);
  });
});
