import { render, screen } from "@testing-library/react";
import { VenueCard } from "@/components/home/venue-card";
import { venues } from "@/data/venues";

it("exposes venue details and a labeled favorite action", () => {
  render(<VenueCard venue={venues[0]} />);
  expect(screen.getByText(venues[0].name)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: new RegExp(`favoritar ${venues[0].name}`, "i") })).toBeInTheDocument();
});
