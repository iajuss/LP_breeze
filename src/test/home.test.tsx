import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

it("renders Breeze’s primary destination", () => {
  render(<HomePage />);
  expect(
    screen.getByRole("heading", {
      level: 1,
      name: /onde boas ideias ganham cenário/i,
    }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /encontrar um espaço/i })).toBeInTheDocument();
});
