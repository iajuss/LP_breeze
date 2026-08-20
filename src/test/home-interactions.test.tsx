import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PhotoRail } from "@/components/home/photo-rail";
import { CorporateShowcase } from "@/components/home/corporate-showcase";
import { DemandSections } from "@/components/home/demand-sections";
import { StyleExplorer } from "@/components/home/style-explorer";
import { TrustTimeline } from "@/components/home/trust-timeline";
import { venues } from "@/data/venues";

const items = [
  {
    id: "festas",
    title: "Festas",
    subtitle: "Celebrações",
    href: "/buscar?activity=Festas",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3",
    imageAlt: "Celebração em um salão",
  },
  {
    id: "casamentos",
    title: "Casamentos",
    subtitle: "Momentos especiais",
    href: "/buscar?activity=Casamentos",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
    imageAlt: "Mesa de casamento",
  },
];

it("exposes photo-rail controls and preserves card destinations", async () => {
  const user = userEvent.setup();
  render(<PhotoRail ariaLabel="Ocasiões" items={items} />);

  await user.click(screen.getByRole("button", { name: "Avançar Ocasiões" }));

  expect(screen.getByRole("link", { name: /festas/i })).toHaveAttribute("href", "/buscar?activity=Festas");
});

it("prepares equivalent copies for a seamless loop and matches arrow colors", () => {
  render(<PhotoRail ariaLabel="Ocasiões" items={items} />);
  const rail = screen.getByRole("region", { name: "Ocasiões" });
  const previous = screen.getByRole("button", { name: "Voltar Ocasiões" });
  const next = screen.getByRole("button", { name: "Avançar Ocasiões" });

  expect(rail.querySelectorAll('[data-loop-copy="0"]')).toHaveLength(items.length);
  expect(rail.querySelectorAll('[data-loop-copy="1"]')).toHaveLength(items.length);
  expect(rail.querySelectorAll('[data-loop-copy="2"]')).toHaveLength(items.length);
  expect(previous).toHaveClass("bg-[var(--primary)]");
  expect(next).toHaveClass("bg-[var(--primary)]");
});

it("keeps demand destinations in the interactive discovery rails", () => {
  render(<DemandSections />);

  expect(screen.getByRole("link", { name: /festas/i })).toHaveAttribute("href", "/buscar?activity=Festas");
  expect(screen.getByRole("link", { name: /são paulo/i })).toHaveAttribute("href", "/espacos/sao-paulo");
  expect(screen.getByRole("link", { name: /espaço para evento corporativo/i })).toHaveAttribute("href", "/guias/escolher-espaco-evento-corporativo");
});

it("keeps the homepage focused exclusively on people looking for spaces", () => {
  render(<DemandSections />);

  expect(screen.queryByText(/anuncie seu espaço|publique seu espaço|sou anfitrião/i)).not.toBeInTheDocument();
  expect(venues.some((venue) => /anuncie|publique/i.test(venue.name))).toBe(false);
});

it("changes the active style panel", async () => {
  const user = userEvent.setup();
  render(<StyleExplorer />);

  await user.click(screen.getByRole("tab", { name: "Jardim" }));

  expect(screen.getByRole("heading", { name: "Jardim" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /explorar espaços com estilo jardim/i })).toHaveAttribute("href", "/buscar?style=jardim");
});

it("shows the selected corporate scenario and keeps the demand CTA", async () => {
  const user = userEvent.setup();
  render(<CorporateShowcase />);

  await user.click(screen.getByRole("button", { name: "Workshop" }));

  expect(screen.getByRole("heading", { name: /workshops que aproximam equipes/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /encontrar espaço para minha empresa/i })).toHaveAttribute("href", "/buscar?activity=Evento+corporativo");
});

it("updates the active clarity criterion", async () => {
  const user = userEvent.setup();
  render(<TrustTimeline />);

  await user.click(screen.getByRole("button", { name: /conversa direta/i }));

  expect(screen.getByRole("heading", { name: "Conversa direta" })).toBeInTheDocument();
  expect(screen.getByText("Demonstração")).toBeInTheDocument();
});

it("draws the clarity line only between timeline markers", () => {
  render(<TrustTimeline />);

  expect(screen.getAllByTestId("trust-line-segment")).toHaveLength(2);
});
