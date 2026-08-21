"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type VenueMapProps = { latitude: number; longitude: number; venueName: string };

export function VenueMap({ latitude, longitude, venueName }: VenueMapProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current || !maplibregl.Map || navigator.userAgent.includes("jsdom")) return;
    const map = new maplibregl.Map({
      container: container.current,
      center: [longitude, latitude],
      zoom: 14,
      attributionControl: { compact: true },
      style: {
        version: 8,
        sources: { openstreetmap: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256, attribution: "© OpenStreetMap contributors" } },
        layers: [{ id: "openstreetmap", type: "raster", source: "openstreetmap" }],
      },
    });
    new maplibregl.Marker({ color: "#15594d" }).setLngLat([longitude, latitude]).setPopup(new maplibregl.Popup().setText(venueName)).addTo(map);
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    return () => map.remove();
  }, [latitude, longitude, venueName]);

  return <div aria-label={`Mapa de ${venueName}`} className="mt-4 aspect-[16/7] overflow-hidden rounded-2xl" ref={container} role="region" />;
}
