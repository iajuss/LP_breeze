import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VenueCard } from "@/components/home/venue-card";
import { venues } from "@/data/venues";
import { formatPriceFrom, priceFrom, venuePriceFrom } from "@/data/venue-pricing";

describe("valor de partida", () => {
  it("define um valor para cada espaço do catálogo", () => {
    venues.forEach((venue) => {
      expect(priceFrom(venue.slug), `${venue.slug} está sem valor de partida`).toBeGreaterThan(0);
    });
  });

  it("formata em reais com separador de milhar", () => {
    expect(formatPriceFrom(3600)).toBe("R$ 3.600");
    expect(formatPriceFrom(14500)).toBe("R$ 14.500");
    expect(formatPriceFrom(900)).toBe("R$ 900");
  });

  it("cobra menos por pessoa conforme o espaço cresce", () => {
    const porPessoa = (slug: string) => venuePriceFrom[slug] / venues.find((v) => v.slug === slug)!.capacity;

    expect(porPessoa("armazem-bras")).toBeLessThan(porPessoa("sala-itaim"));
    expect(porPessoa("galpao-da-luz")).toBeLessThan(porPessoa("casa-jardim-pinheiros"));
  });

  it("cobra mais em bairro nobre que em bairro econômico de porte parecido", () => {
    expect(venuePriceFrom["casa-jardim-pinheiros"]).toBeGreaterThan(venuePriceFrom["casa-republica"]);
    expect(venuePriceFrom["jardim-moema"]).toBeGreaterThan(venuePriceFrom["galeria-tatuape"]);
  });
});

describe("cartão de espaço", () => {
  const espaco = venues.find((v) => v.slug === "casa-jardim-pinheiros")!;

  it("mostra o valor de partida quando pedido", () => {
    render(<VenueCard showPrice venue={espaco} />);

    expect(screen.getByText(/A partir de R\$ 6\.000/)).toBeInTheDocument();
  });

  it("omite o valor por padrão, para não mudar os cartões da home", () => {
    render(<VenueCard venue={espaco} />);

    expect(screen.queryByText(/A partir de/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Valor sob consulta/)).not.toBeInTheDocument();
  });

  it("cai em Valor sob consulta quando o espaço não tem valor definido", () => {
    render(<VenueCard showPrice venue={{ ...espaco, slug: "espaco-sem-preco" }} />);

    expect(screen.getByText("Valor sob consulta")).toBeInTheDocument();
    expect(screen.queryByText(/A partir de/)).not.toBeInTheDocument();
  });
});
