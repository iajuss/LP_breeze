import { notFound } from "next/navigation";
import Link from "next/link";
import { venues } from "@/data/venues";
import { InterestForm } from "@/components/venue/interest-form";
import { VenueMap } from "@/components/venue/venue-map";
import { SupportForm } from "@/components/venue/support-form";
import { VenuePhoto } from "@/components/venue/venue-photo";

type VenuePageProps = { params: Promise<{ slug: string }> };

export default async function VenuePage({ params }: VenuePageProps) {
  const { slug } = await params;
  const venue = venues.find((item) => item.slug === slug);
  if (!venue) notFound();
  const location = venue.region === "São Paulo" ? "São Paulo, SP" : `${venue.region}, São Paulo, SP`;
  return <main className="min-h-screen bg-[var(--secondary)] px-5 py-8 sm:py-16"><div className="mx-auto max-w-6xl"><Link className="text-sm font-semibold text-[var(--primary)]" href="/buscar">← Voltar para a busca</Link><div className="mt-8 grid gap-8 lg:grid-cols-[1fr_25rem]"><section><VenuePhoto alt={venue.imageAlt} src={venue.image} /><p className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">{venue.region} · São Paulo</p><h1 className="mt-3 font-display text-4xl leading-none sm:text-5xl">{venue.name}</h1><p className="mt-5 max-w-2xl text-lg text-[var(--muted)]">{venue.summary}</p><dl className="mt-8 grid gap-4 rounded-3xl bg-white p-6 sm:grid-cols-3"><div><dt className="text-sm text-[var(--muted)]">Capacidade</dt><dd className="mt-1 font-semibold">Até {venue.capacity} pessoas</dd></div><div><dt className="text-sm text-[var(--muted)]">Indicado para</dt><dd className="mt-1 font-semibold">{venue.category}</dd></div><div><dt className="text-sm text-[var(--muted)]">Valor</dt><dd className="mt-1 font-semibold">Sob consulta</dd></div></dl><section className="mt-8 rounded-3xl bg-white p-5 sm:p-6"><h2 className="font-display text-3xl">Localização aproximada</h2><p className="mt-2 text-sm text-[var(--muted)]">{venue.region}, São Paulo — a confirmação de endereço e disponibilidade acontece no atendimento.</p><VenueMap latitude={venue.latitude} longitude={venue.longitude} venueName={venue.name} /></section><SupportForm venueSlug={venue.slug} /></section><aside className="self-start"><InterestForm defaultEventType={venue.category} defaultGuests={venue.capacity > 150 ? 150 : 80} defaultInterestRegion={venue.zone} defaultLocation={location} venueSlug={venue.slug} /></aside></div></div></main>;
}
