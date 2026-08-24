import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PhotoRail } from "@/components/home/photo-rail";
import { CorporateShowcase } from "@/components/home/corporate-showcase";
import { DemandSections } from "@/components/home/demand-sections";
import { StyleExplorer } from "@/components/home/style-explorer";
import { TrustTimeline } from "@/components/home/trust-timeline";
import { venues } from "@/data/venues";
import { categoryRailItems } from "@/data/home-interactions";
import { filterVenues } from "@/lib/venue-results";
import { canonicalActivity } from "@/data/search-options";

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

it("fixes the rail card width so a long title cannot stretch it past the screen", () => {
  render(<PhotoRail ariaLabel="Ocasiões" items={[{ ...items[0], title: "Como escolher um espaço para evento corporativo" }]} />);

  const [card] = screen.getAllByRole("link");
  expect(card).toHaveClass("w-[78vw]", "sm:w-80", "lg:w-96");
  expect(card).not.toHaveClass("min-w-[78vw]", "sm:min-w-80", "lg:min-w-96");
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
  expect(screen.getByRole("link", { name: /espaço para evento corporativo/i })).toHaveAttribute("href", "/guias/escolher-espaco-evento-corporativo");
});

it("keeps each plural category card connected to matching venues", () => {
  const canonicalActivities = { "Produções": "Produção", "Ensaios": "Ensaio", "Lançamentos": "Lançamento" };

  Object.entries(canonicalActivities).forEach(([title, expectedActivity]) => {
    const card = categoryRailItems.find((item) => item.title === title);
    const activity = new URL(card?.href ?? "", "https://arcora.local").searchParams.get("activity");

    expect(activity).toBe(title);
    expect(canonicalActivity(activity ?? "")).toBe(expectedActivity);
    expect(filterVenues(venues, { activity: expectedActivity })).not.toEqual([]);
  });
});

it("leaves regional discovery to the map, without a duplicate rail", () => {
  render(<DemandSections />);

  expect(screen.getByRole("heading", { name: "Onde você quer realizar seu evento?" })).toBeInTheDocument();
  expect(screen.queryByRole("region", { name: "Regiões de São Paulo" })).not.toBeInTheDocument();
  expect(screen.queryByText("Onde procurar")).not.toBeInTheDocument();
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
  expect(screen.getByText("Como funciona")).toBeInTheDocument();
});

it("draws the clarity line only between timeline markers", () => {
  render(<TrustTimeline />);

  const [firstSegment, secondSegment] = screen.getAllByTestId("trust-line-segment");
  expect(firstSegment).toHaveClass("w-[calc(50%_-_1.5rem)]");
  expect(secondSegment).toHaveClass("left-1/2", "w-[calc(50%_-_1.5rem)]");
  expect(screen.getByRole("button", { name: /conversa direta/i })).toHaveClass("md:items-center");
  expect(screen.getByRole("button", { name: /apoio na descoberta/i })).toHaveClass("md:items-end");
});

it("aligns the corporate CTA with the complete scenario control row", () => {
  render(<CorporateShowcase />);

  expect(screen.getByRole("link", { name: /encontrar espaço para minha empresa/i })).toHaveClass("w-[22rem]", "max-w-full");
});
