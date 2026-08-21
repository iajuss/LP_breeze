import { render, screen } from "@testing-library/react";
import { VenueMap } from "@/components/venue/venue-map";

it("renders an accessible map container for the venue location", () => {
  render(<VenueMap latitude={-23.5614} longitude={-46.6912} venueName="Casa Jardim Pinheiros" />);
  expect(screen.getByLabelText("Mapa de Casa Jardim Pinheiros")).toBeInTheDocument();
});
