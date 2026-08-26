import { render, screen } from "@testing-library/react";
import { VenueCard } from "@/components/home/venue-card";
import { venues } from "@/data/venues";

it("links to the venue detail route", () => {
  render(<VenueCard venue={venues[0]} />);
  expect(screen.getByText(venues[0].name)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: new RegExp(`ver detalhes de ${venues[0].name}`, "i") })).toHaveAttribute("href", "/espacos/casa-jardim-pinheiros");
});

it("preserves a declared region in the venue detail link", () => {
  render(<VenueCard venue={venues[0]} regionInterest="Oeste" />);

  expect(screen.getByRole("link", { name: /ver detalhes/i })).toHaveAttribute("href", "/espacos/casa-jardim-pinheiros?regionInterest=Oeste");
});

it("preserves the selected compatible occasion when opening a venue", () => {
  render(<VenueCard venue={venues[0]} activity="Casamento" />);

  expect(screen.getByRole("link", { name: /ver detalhes/i })).toHaveAttribute("href", "/espacos/casa-jardim-pinheiros?activity=Casamento");
});

it("preserves the compatible occasion together with the regional preference", () => {
  render(<VenueCard venue={venues[0]} activity="Casamento" regionInterest="Oeste" />);

  expect(screen.getByRole("link", { name: /ver detalhes/i })).toHaveAttribute("href", "/espacos/casa-jardim-pinheiros?activity=Casamento&regionInterest=Oeste");
});

it("preserves any selected occasion in the venue detail link", () => {
  render(<VenueCard venue={venues[0]} activity="Workshop" />);

  expect(screen.getByRole("link", { name: /ver detalhes/i })).toHaveAttribute("href", "/espacos/casa-jardim-pinheiros?activity=Workshop");
});

it("keeps the primary category visible while the venue offers multiple occasions", () => {
  render(<VenueCard venue={venues[0]} />);

  expect(screen.getByText(/120 pessoas · Festa/)).toBeInTheDocument();
  expect(venues[0].eventTypes).toContain("Casamento");
});

it("resumes as ocasiões extras sem esconder a lista completa de tecnologias assistivas", () => {
  const flexibleVenue = {
    ...venues[0],
    eventTypes: [
      "Festa",
      "Casamento",
      "Evento corporativo",
      "Reunião",
      "Workshop",
      "Produção",
      "Ensaio",
      "Lançamento",
    ],
  };

  render(<VenueCard venue={flexibleVenue} />);

  expect(screen.getByText("Festa")).toBeInTheDocument();
  expect(screen.getByText("Casamento")).toBeInTheDocument();
  expect(screen.getAllByTestId("occasion-chip")).toHaveLength(2);
  expect(screen.getByTestId("more-occasion-types")).toHaveAccessibleName("Mais 6 tipos: Evento corporativo, Reunião, Workshop, Produção, Ensaio, Lançamento");
  expect(screen.getByTestId("more-occasion-types")).toHaveTextContent("+6");
});
