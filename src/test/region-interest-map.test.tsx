import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegionInterestMap } from "@/components/home/region-interest-map";

it("selects a region with an accessible button and exposes its search link", async () => {
  const user = userEvent.setup();
  render(<RegionInterestMap />);

  await user.click(screen.getByRole("button", { name: "Oeste" }));

  expect(screen.getByRole("button", { name: "Oeste" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("link", { name: /ver espaços nesta região/i })).toHaveAttribute("href", "/buscar?regionInterest=Oeste");
});

it("renders the five text alternatives without creating a map in JSDOM", () => {
  render(<RegionInterestMap />);

  expect(screen.getByLabelText("Mapa para escolher região de interesse")).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: /centro|norte|sul|leste|oeste/i })).toHaveLength(5);
});
