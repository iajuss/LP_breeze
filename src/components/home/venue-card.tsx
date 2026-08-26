import Link from "next/link";
import type { Venue } from "@/types/content";
import type { InterestRegion } from "@/data/regions";
import { canonicalActivity } from "@/data/search-options";

export function VenueCard({ venue, featured = false, regionInterest, activity }: { venue: Venue; featured?: boolean; regionInterest?: InterestRegion; activity?: string }) {
  const requestedActivity = activity ? canonicalActivity(activity) : undefined;
  const parameters = new URLSearchParams();
  if (requestedActivity && venue.eventTypes.includes(requestedActivity)) parameters.set("activity", requestedActivity);
  if (regionInterest) parameters.set("regionInterest", regionInterest);
  const query = parameters.toString();
  const href = query ? `/espacos/${venue.slug}?${query}` : `/espacos/${venue.slug}`;
  const visibleEventTypes = venue.eventTypes.slice(0, 2);
  const extraEventTypes = venue.eventTypes.slice(2);

  return <article className={featured ? "group lg:col-span-2" : "group"}><Link aria-label={`Ver detalhes de ${venue.name}`} href={href}><div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--secondary)] bg-cover bg-center transition duration-500 group-hover:scale-[1.01]" role="img" aria-label={venue.imageAlt} style={{ backgroundImage: `url(${venue.image})` }} /></Link><Link className="mt-3 block" href={href}><h3 className="font-display text-2xl leading-tight">{venue.name}</h3><p className="mt-1 text-sm text-[var(--muted)]">{venue.region} · {venue.city}</p><p className="mt-2 text-sm">Até {venue.capacity} pessoas · {venue.category}</p><div className="mt-3 flex flex-wrap gap-2" aria-label={`Ocasiões atendidas: ${venue.eventTypes.join(", ")}`}>{visibleEventTypes.map((eventType) => <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-[var(--primary)] ring-1 ring-[var(--primary)]/15" data-testid="occasion-chip" key={eventType}>{eventType}</span>)}{extraEventTypes.length > 0 ? <span aria-label={`Mais ${extraEventTypes.length} tipos: ${extraEventTypes.join(", ")}`} className="rounded-full bg-[var(--primary)] px-2.5 py-1 text-xs font-semibold text-white" data-testid="more-occasion-types" title={`Também atende: ${extraEventTypes.join(", ")}`}>+{extraEventTypes.length}</span> : null}</div></Link></article>;
}
