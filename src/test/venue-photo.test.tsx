import { render, screen } from "@testing-library/react";
import { VenuePhoto } from "@/components/venue/venue-photo";

it("renders the venue image using the supplied source", () => {
  render(<VenuePhoto alt="Casa com jardim" src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3" />);
  expect(screen.getByRole("img", { name: "Casa com jardim" })).toHaveStyle({ backgroundImage: "url(https://images.unsplash.com/photo-1519167758481-83f550bb49b3)" });
});
