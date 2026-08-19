"use client";

import { useEffect, useRef, type ReactNode } from "react";

type DialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Dialog({ open, title, onClose, children }: DialogProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40 p-3 sm:items-center sm:justify-center" role="presentation">
      <section aria-modal="true" aria-labelledby="search-sheet-title" className="w-full max-w-lg rounded-2xl bg-[var(--surface)] p-5 shadow-2xl" role="dialog">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl text-[var(--foreground)]" id="search-sheet-title">{title}</h2>
          <button aria-label="Fechar busca" className="min-h-11 min-w-11 rounded-full border border-[var(--border)] text-lg" onClick={onClose} ref={closeButtonRef} type="button">×</button>
        </div>
        {children}
      </section>
    </div>
  );
}
