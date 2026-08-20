"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolledState = () => setScrolled(window.scrollY > 16);
    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolledState);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 text-white transition-[background-color,box-shadow,backdrop-filter] duration-300 ${scrolled ? "bg-[rgba(16,46,40,0.88)] shadow-lg shadow-black/10 backdrop-blur-md" : "bg-transparent"}`}
      data-scrolled={scrolled}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:py-6 lg:px-8">
        <Link className="font-display text-2xl md:text-3xl" href="/">Breeze</Link>
        <nav aria-label="Principal" className="hidden items-center gap-7 text-sm font-semibold md:flex">
          <a href="#como-funciona">Como funciona</a>
          <a href="#empresas">Para empresas</a>
          <a href="#espacos">Explorar espaços</a>
        </nav>
        <a className="min-h-11 rounded-full border border-white/70 px-4 py-2 text-sm font-semibold md:hidden" href="#buscar">Buscar</a>
      </div>
    </header>
  );
}
