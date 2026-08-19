import Link from "next/link";
import type { Venue } from "@/types/content";
import { FavoriteButton } from "@/components/ui/favorite-button";

const photos = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85",
];

export function VenueCard({ venue, featured = false }: { venue: Venue; featured?: boolean }) {
  const photo = photos[Math.abs(venue.id.length) % photos.length];
  return <article className={featured ? "group lg:col-span-2" : "group"}><div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--secondary)] bg-cover bg-center transition duration-500 group-hover:scale-[1.01]" role="img" aria-label={venue.imageAlt} style={{ backgroundImage: `url(${photo})` }}><FavoriteButton venueName={venue.name} /></div><Link className="mt-3 block" href={`/buscar?activity=${encodeURIComponent(venue.category)}&location=${encodeURIComponent(`${venue.city}, ${venue.region}`)}`}><div className="flex items-start justify-between gap-3"><h3 className="font-display text-2xl leading-tight">{venue.name}</h3><span className="text-xs text-[var(--muted)]">Demo</span></div><p className="mt-1 text-sm text-[var(--muted)]">{venue.region} · {venue.city}</p><p className="mt-2 text-sm">Até {venue.capacity} pessoas · {venue.category}</p>{venue.rating && <p className="mt-2 text-sm font-medium">★ {venue.rating.toFixed(1)} <span className="font-normal text-[var(--muted)]">· avaliação demonstrativa</span></p>}</Link></article>;
}
