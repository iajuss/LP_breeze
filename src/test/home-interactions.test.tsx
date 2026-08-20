import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PhotoRail } from "@/components/home/photo-rail";

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
