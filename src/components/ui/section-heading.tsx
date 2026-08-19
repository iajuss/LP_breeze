import type { ReactNode } from "react";

type SectionHeadingProps = { eyebrow?: string; children: ReactNode; description?: string; align?: "left" | "center" };

export function SectionHeading({ eyebrow, children, description, align = "left" }: SectionHeadingProps) {
  return <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
    {eyebrow ? <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">{eyebrow}</p> : null}
    <h2 className="text-3xl leading-tight md:text-4xl">{children}</h2>
    {description ? <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">{description}</p> : null}
  </div>;
}
