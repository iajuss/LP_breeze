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

it("keeps the primary category visible while the venue offers multiple occasions", () => {
  render(<VenueCard venue={venues[0]} />);

  expect(screen.getByText(/120 pessoas · Festa/)).toBeInTheDocument();
  expect(venues[0].eventTypes).toContain("Casamento");
});
