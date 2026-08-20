import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Faq } from "@/components/home/faq";
import { DemandSections } from "@/components/home/demand-sections";
import { faqs } from "@/data/faqs";

it("opens an FAQ answer with the keyboard", async () => {
  const user = userEvent.setup();
  render(<Faq items={faqs} />);
  const trigger = screen.getByRole("button", { name: /como encontro um espaço/i });
  trigger.focus();
  await user.keyboard("{Enter}");
  expect(trigger).toHaveAttribute("aria-expanded", "true");
});

it("moves the how-it-works carousel to the next step", async () => {
  const user = userEvent.setup();
  render(<DemandSections />);

  expect(screen.getByText("Etapa 1 de 3")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Próxima etapa" }));

  expect(screen.getByText("Etapa 2 de 3")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Compare" })).toBeInTheDocument();
});

it("moves the how-it-works carousel with the arrow keys", async () => {
  const user = userEvent.setup();
  render(<DemandSections />);

  screen.getByRole("region", { name: "Como funciona" }).focus();
  await user.keyboard("{ArrowRight}");

  expect(screen.getByText("Etapa 2 de 3")).toBeInTheDocument();
});

it("moves the how-it-works carousel when swiping left", () => {
  render(<DemandSections />);
  const carousel = screen.getByRole("region", { name: "Como funciona" });

  fireEvent.pointerDown(carousel, { clientX: 240 });
  fireEvent.pointerUp(carousel, { clientX: 120 });

  expect(screen.getByText("Etapa 2 de 3")).toBeInTheDocument();
});
