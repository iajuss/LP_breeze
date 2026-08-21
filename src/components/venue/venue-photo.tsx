type VenuePhotoProps = { src: string; alt: string };

export function VenuePhoto({ src, alt }: VenuePhotoProps) {
  return <div aria-label={alt} className="aspect-[4/3] rounded-3xl bg-[var(--foreground)] bg-cover bg-center sm:aspect-[16/9]" role="img" style={{ backgroundImage: `url(${src})` }} />;
}
