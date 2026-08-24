import { buildSearchUrl, validateSearch } from "@/lib/search";
import { venues } from "@/data/venues";
import { filterVenues } from "@/lib/venue-results";
import { activityOptions, canonicalActivity, canonicalStyle } from "@/data/search-options";
import { categories } from "@/data/categories";
import { styles } from "@/data/styles";

describe("buildSearchUrl", () => {
  it("builds a stable query from selected search fields", () => {
    expect(
      buildSearchUrl({
        activity: "Festa",
        location: "São Paulo, SP",
        date: "",
        guests: 80,
      }),
    ).toBe("/buscar?activity=Festa&location=S%C3%A3o+Paulo%2C+SP&guests=80");
  });
});

describe("validateSearch", () => {
  it("rejects a location that was not selected from the São Paulo catalogue", () => {
    expect(validateSearch({ activity: "Festa", location: "Rio de Janeiro", date: "", guests: 80 }).location)
      .toBe("Selecione uma localização da lista em São Paulo.");
  });
});

describe("filterVenues", () => {
  it("finds production venues for the new rehearsal activity", () => {
    expect(filterVenues(venues, { activity: "Ensaio" })).toContainEqual(expect.objectContaining({ slug: "estudio-santo-amaro" }));
  });

  it("finds corporate venues for the new launch activity", () => {
    expect(filterVenues(venues, { activity: "Lançamento" })).toContainEqual(expect.objectContaining({ slug: "terraco-vila-madalena" }));
  });
});

describe("canonicalActivity", () => {
  it("resolve o plural de todo cartão de atalho para uma opção do filtro", () => {
    categories.forEach((category) => {
      const resolved = canonicalActivity(category.name);
      expect(resolved, `o cartão "${category.name}" não resolve para nenhuma ocasião`).toBeDefined();
      expect(activityOptions).toContain(resolved!);
    });
  });

  it("resolve plurais em ão/ões, que o corte de s final não alcança", () => {
    expect(canonicalActivity("Reuniões")).toBe("Reunião");
    expect(canonicalActivity("Produções")).toBe("Produção");
  });

  it("mantém uma ocasião já canônica intacta e recusa o que não conhece", () => {
    activityOptions.forEach((option) => expect(canonicalActivity(option)).toBe(option));
    expect(canonicalActivity("Chá de bebê")).toBeUndefined();
  });
});

describe("canonicalStyle", () => {
  it("resolve o slug usado pelos atalhos para o rótulo do filtro", () => {
    styles.forEach((style) => {
      expect(canonicalStyle(style.slug)).toBe(style.name);
      expect(canonicalStyle(style.name)).toBe(style.name);
    });
  });
});
