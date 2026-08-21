import { buildSearchUrl, validateSearch } from "@/lib/search";

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
