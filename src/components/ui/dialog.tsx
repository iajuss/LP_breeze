"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type DialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Dialog({ open, title, onClose, children }: DialogProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end bg-black/40 p-3 sm:items-center sm:justify-center" role="presentation">
      <section aria-modal="true" aria-labelledby="search-sheet-title" className="max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[var(--surface)] p-5 text-[var(--foreground)] shadow-2xl" role="dialog">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl text-[var(--foreground)]" id="search-sheet-title">{title}</h2>
          <button aria-label="Fechar busca" className="inline-flex min-h-11 items-center gap-1 rounded-full border border-[var(--border)] px-3 text-sm font-semibold" onClick={onClose} ref={closeButtonRef} type="button"><span>Fechar</span><span aria-hidden="true" className="text-lg leading-none">×</span></button>
        </div>
        {children}
      </section>
    </div>,
    document.body,
  );
}
