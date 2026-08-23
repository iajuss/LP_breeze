import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { venues } from "@/data/venues";
import { filterVenues, venueLocation } from "@/lib/venue-results";
import { interestRegions } from "@/data/regions";
import { canonicalLocation, locationOptions } from "@/data/search-options";

const migrations = readdirSync(resolve(process.cwd(), "supabase/migrations"))
  .map((file) => readFileSync(resolve(process.cwd(), "supabase/migrations", file), "utf8"))
  .join("\n");

describe("catálogo de espaços", () => {
  it("oferece ao menos um espaço em cada região selecionável no mapa", () => {
    interestRegions.forEach((region) => {
      expect(venues.filter((venue) => venue.zone === region).length, `nenhum espaço na zona ${region}`).toBeGreaterThan(0);
    });
  });

  it("mantém cada espaço do catálogo semeado no Supabase", () => {
    venues.forEach((venue) => {
      expect(migrations, `${venue.slug} não está em nenhuma migration`).toContain(`('${venue.slug}',`);
    });
  });

  it("mantém o bairro de cada espaço aceito pela validação do formulário", () => {
    venues.forEach((venue) => {
      expect(canonicalLocation(`${venue.region}, São Paulo, SP`), `bairro de ${venue.slug} fora de locationOptions`).toBeTruthy();
    });
  });

  it("encontra cada espaço pela sua própria localização", () => {
    venues.forEach((venue) => {
      const encontrados = filterVenues(venues, { location: venueLocation(venue) }).map((item) => item.id);
      expect(encontrados, `${venue.slug} não é encontrado por "${venueLocation(venue)}"`).toContain(venue.id);
    });
  });

  it("não deixa nenhuma opção do filtro de localização sem resultado", () => {
    locationOptions.forEach((option) => {
      expect(filterVenues(venues, { location: option }).length, `"${option}" não retorna espaço algum`).toBeGreaterThan(0);
    });
  });

  it("não repete slug nem identificador", () => {
    expect(new Set(venues.map((venue) => venue.slug)).size).toBe(venues.length);
    expect(new Set(venues.map((venue) => venue.id)).size).toBe(venues.length);
  });
});
