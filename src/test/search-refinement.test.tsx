import { render, screen } from "@testing-library/react";
import { SearchRefinementForm } from "@/components/search/search-refinement-form";

describe("SearchRefinementForm", () => {
  it("greens the filter fields only on hover and focus, with no border or focus box", () => {
    render(<SearchRefinementForm values={{ activity: "Festa" }} />);

    [screen.getByLabelText("Outra quantidade de pessoas"), screen.getByLabelText("Data do evento")].forEach((field) => {
      expect(field).toHaveClass("search-field", "bg-[var(--background)]", "hover:bg-[var(--secondary)]", "focus:bg-[var(--secondary)]");
      expect(field).not.toHaveClass("border-2", "hover:border-[var(--primary)]", "focus:border-[var(--primary)]");
    });
  });

  it("keeps the submit action green instead of turning it dark on interaction", () => {
    render(<SearchRefinementForm values={{ activity: "Festa" }} />);

    const submit = screen.getByRole("button", { name: "Aplicar filtros" });
    expect(submit).toHaveClass("search-field", "hover:bg-[#103d35]", "focus-visible:bg-[#103d35]");
    expect(submit).not.toHaveClass("hover:bg-[var(--foreground)]", "focus-visible:outline-offset-2");
  });

  it("tints the calendar trigger itself instead of drawing a box behind it", () => {
    render(<SearchRefinementForm values={{ activity: "Festa" }} />);

    const trigger = screen.getByRole("button", { name: "Abrir calendário" });
    expect(trigger).toHaveClass("icon-button", "bg-transparent");
    expect(trigger).not.toHaveClass("hover:bg-[var(--secondary)]", "focus-visible:bg-[var(--secondary)]");
  });
});
