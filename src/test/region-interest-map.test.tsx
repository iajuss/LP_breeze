import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
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

it("registers the preference the moment it is chosen, before any form is sent", async () => {
  const user = userEvent.setup();
  const listener = vi.fn();
  window.addEventListener("arcora:analytics", listener);
  render(<RegionInterestMap />);

  await user.click(screen.getByRole("button", { name: "Norte" }));

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener.mock.calls[0][0].detail).toMatchObject({
    event: "region_interest_selected",
    properties: { regionInterest: "Norte" },
  });

  await user.click(screen.getByRole("button", { name: "Norte" }));
  expect(listener, "reclicar a mesma região não deve duplicar o registro").toHaveBeenCalledTimes(1);

  await user.click(screen.getByRole("button", { name: "Sul" }));
  expect(listener).toHaveBeenCalledTimes(2);
  window.removeEventListener("arcora:analytics", listener);
});
