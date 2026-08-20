import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VenueSearch } from "@/components/search/venue-search";

describe("VenueSearch", () => {
  it("keeps desktop search labels readable over its white surface", () => {
    render(<VenueSearch entryPoint="hero" />);

    expect(screen.getByRole("combobox", { name: /o que você está planejando/i }).closest("form")).toHaveClass("text-[var(--foreground)]");
  });

  it("keeps mobile selections when returning to an earlier step", async () => {
    const user = userEvent.setup();
    render(<VenueSearch entryPoint="hero" />);

    await user.click(screen.getByRole("button", { name: /encontrar um espaço/i }));
    await user.click(screen.getByRole("button", { name: /^festa$/i }));
    await user.click(screen.getByRole("button", { name: /voltar/i }));

    expect(screen.getByText(/festa selecionada/i)).toBeInTheDocument();
  });

  it("shows readable controls and a cancel action in the first mobile step", async () => {
    const user = userEvent.setup();
    render(<VenueSearch entryPoint="hero" />);

    await user.click(screen.getByRole("button", { name: /encontrar um espaço/i }));

    expect(screen.getByRole("dialog")).toHaveClass("text-[var(--foreground)]");
    expect(screen.getByRole("button", { name: /fechar busca/i })).toHaveTextContent("Fechar");

    await user.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("restarts the mobile flow after it is closed", async () => {
    const user = userEvent.setup();
    render(<VenueSearch entryPoint="hero" />);

    await user.click(screen.getByRole("button", { name: /encontrar um espaço/i }));
    await user.click(screen.getByRole("button", { name: /^festa$/i }));
    await user.click(screen.getByRole("button", { name: /fechar busca/i }));
    await user.click(screen.getByRole("button", { name: /encontrar um espaço/i }));

    expect(screen.getByText("Etapa 1 de 4")).toBeInTheDocument();
  });
});
