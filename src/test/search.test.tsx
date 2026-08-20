import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { DesktopSearchForm } from "@/components/search/desktop-search-form";
import { VenueSearch } from "@/components/search/venue-search";
import { emptySearchValues } from "@/components/search/search-types";

describe("VenueSearch", () => {
  it("opens the desktop occasion menu downward and selects an occasion", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DesktopSearchForm errors={{}} onChange={onChange} onSubmit={vi.fn()} values={emptySearchValues} />);

    await user.click(screen.getByRole("button", { name: /escolha uma ocasião/i }));

    expect(screen.getByRole("listbox")).toHaveClass("top-full");
    await user.click(screen.getByRole("option", { name: "Festa" }));

    expect(onChange).toHaveBeenCalledWith({ ...emptySearchValues, activity: "Festa" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes the desktop occasion menu with Escape", async () => {
    const user = userEvent.setup();
    render(<DesktopSearchForm errors={{}} onChange={vi.fn()} onSubmit={vi.fn()} values={emptySearchValues} />);

    await user.click(screen.getByRole("button", { name: /escolha uma ocasião/i }));
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("hides the number-input arrows for guest quantity", () => {
    render(<DesktopSearchForm errors={{}} onChange={vi.fn()} onSubmit={vi.fn()} values={emptySearchValues} />);

    expect(screen.getByRole("spinbutton", { name: /pessoas/i })).toHaveClass("[appearance:textfield]");
  });

  it("keeps desktop search labels readable over its white surface", () => {
    render(<VenueSearch entryPoint="hero" />);

    expect(screen.getByRole("button", { name: /o que você está planejando/i }).closest("form")).toHaveClass("text-[var(--foreground)]");
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
