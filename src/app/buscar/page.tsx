import Link from "next/link";

type SearchPageProps = { searchParams: Promise<{ activity?: string; location?: string; date?: string; guests?: string }> };

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const values = await searchParams;
  return <main className="mx-auto min-h-screen max-w-3xl px-6 py-20"><Link className="text-sm font-semibold text-[var(--primary)]" href="/">← Voltar para a Breeze</Link><h1 className="mt-8 font-display text-5xl">Sua busca começa aqui.</h1><p className="mt-4 text-[var(--muted)]">Estamos preparando espaços que combinam com o que você imaginou.</p><dl className="mt-10 grid gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2"><div><dt className="text-sm text-[var(--muted)]">Ocasião</dt><dd className="font-semibold">{values.activity || "A definir"}</dd></div><div><dt className="text-sm text-[var(--muted)]">Local</dt><dd className="font-semibold">{values.location || "A definir"}</dd></div><div><dt className="text-sm text-[var(--muted)]">Data</dt><dd className="font-semibold">{values.date || "A definir"}</dd></div><div><dt className="text-sm text-[var(--muted)]">Pessoas</dt><dd className="font-semibold">{values.guests || "A definir"}</dd></div></dl></main>;
}
