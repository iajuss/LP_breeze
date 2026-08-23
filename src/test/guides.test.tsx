import { render, screen } from "@testing-library/react";
import GuidePage from "@/app/guias/[slug]/page";

it("renders the corporate venue guide with its practical CTA", async () => {
  const page = await GuidePage({ params: Promise.resolve({ slug: "escolher-espaco-evento-corporativo" }) });
  render(page);

  expect(screen.getByRole("heading", { name: /como escolher um espaço/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /buscar espaços/i })).toHaveAttribute("href", "/buscar?activity=Evento+corporativo");
});

it.each([
  ["checklist-espaco-casamento", "Checklist para encontrar o espaço do casamento", "Observe plano B para chuva, horários e regras do local.", "/buscar?activity=Casamento"],
  ["calcular-capacidade-evento", "Como calcular a capacidade do seu evento", "Reserve circulação, apoio técnico e áreas de serviço no cálculo.", "/buscar"],
])("renders the practical recommendations for %s", async (slug, title, recommendation, href) => {
  const page = await GuidePage({ params: Promise.resolve({ slug }) });
  render(page);

  expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
  expect(screen.getByText(recommendation)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /buscar espaços/i })).toHaveAttribute("href", href);
});

it("returns notFound for an unknown guide slug", async () => {
  await expect(GuidePage({ params: Promise.resolve({ slug: "inexistente" }) })).rejects.toThrow();
});
