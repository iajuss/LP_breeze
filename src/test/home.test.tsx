import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

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
