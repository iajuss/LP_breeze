import Link from "next/link";

export default function InterestConfirmedPage() {
  return <main className="grid min-h-screen place-items-center bg-[var(--secondary)] px-5"><section className="max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Interesse confirmado</p><h1 className="mt-3 font-display text-4xl">Recebemos seu pedido.</h1><p className="mt-4 text-[var(--muted)]">Nossa equipe usará os dados do seu evento para entrar em contato e continuar a conversa.</p><Link className="mt-7 inline-flex rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white" href="/buscar">Continuar explorando</Link></section></main>;
}
