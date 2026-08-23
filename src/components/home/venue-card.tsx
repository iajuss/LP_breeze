import Link from "next/link";
import type { Venue } from "@/types/content";
import type { InterestRegion } from "@/data/regions";

export function VenueCard({ venue, featured = false, regionInterest }: { venue: Venue; featured?: boolean; regionInterest?: InterestRegion }) {
  const href = regionInterest ? `/espacos/${venue.slug}?regionInterest=${encodeURIComponent(regionInterest)}` : `/espacos/${venue.slug}`;
  return <article className={featured ? "group lg:col-span-2" : "group"}><Link aria-label={`Ver detalhes de ${venue.name}`} href={href}><div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--secondary)] bg-cover bg-center transition duration-500 group-hover:scale-[1.01]" role="img" aria-label={venue.imageAlt} style={{ backgroundImage: `url(${venue.image})` }} /></Link><Link className="mt-3 block" href={href}><h3 className="font-display text-2xl leading-tight">{venue.name}</h3><p className="mt-1 text-sm text-[var(--muted)]">{venue.region} · {venue.city}</p><p className="mt-2 text-sm">Até {venue.capacity} pessoas · {venue.category}</p></Link></article>;
}
