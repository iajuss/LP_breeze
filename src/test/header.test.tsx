import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { Header } from "@/components/layout/header";

it("adds a readable background layer after the visitor scrolls", () => {
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  render(<Header />);

  const header = screen.getByRole("banner");
  expect(header).toHaveAttribute("data-scrolled", "false");

  act(() => {
    Object.defineProperty(window, "scrollY", { configurable: true, value: 80 });
    fireEvent.scroll(window);
  });

  expect(header).toHaveAttribute("data-scrolled", "true");
});

it("keeps homepage shortcuts in page order without an entry action", () => {
  render(<Header />);

  const navigation = screen.getByRole("navigation", { name: "Principal" });
  expect(within(navigation).getAllByRole("link").map((link) => link.textContent)).toEqual([
    "Como funciona",
    "Para empresas",
    "Explorar espaços",
  ]);
});
