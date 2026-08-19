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
});
