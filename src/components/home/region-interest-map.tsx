"use client";

import Link from "next/link";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { interestRegions, type InterestRegion } from "@/data/regions";

const regionCoordinates: Record<InterestRegion, [number, number]> = {
  Centro: [-46.6337, -23.5505],
  Norte: [-46.6504, -23.4758],
  Sul: [-46.6377, -23.625],
  Leste: [-46.49, -23.543],
  Oeste: [-46.71, -23.555],
};

export function RegionInterestMap() {
  const container = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<InterestRegion>();
  const href = selected ? `/buscar?regionInterest=${encodeURIComponent(selected)}` : undefined;

  useEffect(() => {
    if (!container.current || !maplibregl.Map || navigator.userAgent.includes("jsdom")) return;

    const map = new maplibregl.Map({
      container: container.current,
      center: regionCoordinates.Centro,
      zoom: 11,
      attributionControl: { compact: true },
      style: {
        version: 8,
        sources: { openstreetmap: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256, attribution: "© OpenStreetMap contributors" } },
        layers: [{ id: "openstreetmap", type: "raster", source: "openstreetmap" }],
      },
    });

    interestRegions.forEach((region) => {
      const marker = document.createElement("button");
      marker.type = "button";
      marker.ariaLabel = `Selecionar região ${region}`;
      marker.className = "min-h-11 min-w-11 rounded-full bg-[var(--primary)] px-3 text-sm font-semibold text-white shadow-lg";
      marker.textContent = region;
      marker.addEventListener("click", () => setSelected(region));
      new maplibregl.Marker({ element: marker }).setLngLat(regionCoordinates[region]).addTo(map);
    });

    return () => map.remove();
  }, []);

  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-2 lg:gap-8">
      <div aria-label="Mapa para escolher região de interesse" className="min-h-80 overflow-hidden rounded-3xl bg-[var(--secondary)]" ref={container} role="region" />
      <div className="flex flex-col justify-center">
        <p className="text-[var(--muted)]">Selecione uma região no mapa ou use os botões para ver espaços mais próximos da sua preferência.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Regiões de interesse">
          {interestRegions.map((region) => (
            <button
              aria-pressed={selected === region}
              className={`min-h-11 rounded-xl border px-4 py-2 text-sm font-semibold transition focus-visible:outline-[var(--primary)] ${selected === region ? "border-[var(--primary)] bg-[var(--primary)] text-white" : "border-[var(--border)] bg-white hover:border-[var(--primary)]"}`}
              key={region}
              onClick={() => setSelected(region)}
              type="button"
            >
              {region}
            </button>
          ))}
        </div>
        {href && (
          <Link aria-label="Ver espaços nesta região" className="mt-6 inline-flex min-h-11 w-fit items-center rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white hover:opacity-90" href={href}>
            Ver espaços nesta região <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
