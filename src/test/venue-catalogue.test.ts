import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { venues } from "@/data/venues";
import { interestRegions } from "@/data/regions";
import { canonicalLocation } from "@/data/search-options";

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

  it("não repete slug nem identificador", () => {
    expect(new Set(venues.map((venue) => venue.slug)).size).toBe(venues.length);
    expect(new Set(venues.map((venue) => venue.id)).size).toBe(venues.length);
  });
});
