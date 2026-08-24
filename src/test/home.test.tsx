import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";
import { FeaturedVenues } from "@/components/home/featured-venues";

it("renders Arcora’s primary destination", () => {
  render(<HomePage />);
  expect(
    screen.getByRole("heading", {
      level: 1,
      name: /onde boas ideias ganham cenário/i,
    }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /encontrar um espaço/i })).toHaveClass("text-[var(--foreground)]");
  expect(document.getElementById("espacos")).toHaveClass("scroll-mt-28");
  expect(document.getElementById("como-funciona")).toHaveClass("scroll-mt-28");
  expect(document.getElementById("empresas")).toHaveClass("scroll-mt-28");
});

it("shows a curated set of six spaces and a path to the full catalogue", () => {
  render(<FeaturedVenues />);

  expect(screen.getAllByRole("link", { name: /ver detalhes de/i })).toHaveLength(6);
  expect(screen.getByRole("link", { name: /ver todos os espaços/i })).toHaveAttribute("href", "/buscar");
});
