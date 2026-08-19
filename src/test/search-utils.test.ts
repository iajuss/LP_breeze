import { buildSearchUrl } from "@/lib/search";

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
