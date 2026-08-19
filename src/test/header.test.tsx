import { act, fireEvent, render, screen } from "@testing-library/react";
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
