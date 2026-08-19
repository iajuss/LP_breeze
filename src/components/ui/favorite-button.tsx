"use client";

import { useState } from "react";

export function FavoriteButton({ venueName }: { venueName: string }) {
  const [saved, setSaved] = useState(false);
  return <button aria-label={`${saved ? "Remover dos favoritos" : "Favoritar"} ${venueName}`} aria-pressed={saved} className="absolute right-3 top-3 min-h-11 min-w-11 rounded-full bg-white/90 text-lg text-[var(--foreground)]" onClick={() => setSaved((value) => !value)} type="button">{saved ? "♥" : "♡"}</button>;
}
