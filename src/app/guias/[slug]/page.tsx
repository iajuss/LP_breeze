import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/data/editorial";

const guideDetails: Record<string, { href: string; points: string[] }> = {
  "escolher-espaco-evento-corporativo": {
    href: "/buscar?activity=Evento+corporativo",
    points: [
      "Defina o objetivo do encontro e o formato da agenda.",
      "Confirme capacidade, acessibilidade e infraestrutura técnica.",
      "Compare localização e experiência de chegada para sua equipe.",
    ],
  },
  "checklist-espaco-casamento": {
    href: "/buscar?activity=Casamento",
    points: [
      "Liste prioridades do casal e número estimado de convidados.",
      "Observe plano B para chuva, horários e regras do local.",
      "Visite os finalistas com fornecedores que precisam de estrutura.",
    ],
  },
  "calcular-capacidade-evento": {
    href: "/buscar",
    points: [
      "Comece pela quantidade esperada e inclua uma margem realista.",
      "Considere o formato: auditório, mesas, coquetel ou pista.",
      "Reserve circulação, apoio técnico e áreas de serviço no cálculo.",
    ],
  },
};

type GuidePageProps = { params: Promise<{ slug: string }> };

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  const details = guideDetails[slug];

  if (!article || !details) notFound();

  return (
    <main className="min-h-screen bg-[var(--secondary)] px-5 py-8 sm:py-16">
      <article className="mx-auto max-w-3xl rounded-3xl bg-white p-6 sm:p-10 lg:p-12">
        <Link className="text-sm font-semibold text-[var(--primary)]" href="/">
          ← Início
        </Link>
        <p className="mt-10 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Guia Arcora</p>
        <h1 className="mt-3 font-display text-4xl leading-[0.98] sm:text-5xl">{article.title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">{article.excerpt}</p>

        <section className="mt-10" aria-labelledby="roteiro-pratico">
          <h2 className="font-display text-3xl" id="roteiro-pratico">Um roteiro prático para começar</h2>
          <ol className="mt-5 space-y-4">
            {details.points.map((point, index) => (
              <li className="flex gap-4" key={point}>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--secondary)] text-sm font-semibold text-[var(--primary)]">{index + 1}</span>
                <p className="pt-1 text-[var(--foreground)]">{point}</p>
              </li>
            ))}
          </ol>
        </section>

        <Link className="mt-10 inline-flex min-h-11 items-center rounded-full bg-[var(--primary)] px-6 py-3 font-semibold text-white hover:bg-[var(--foreground)]" href={details.href}>
          Buscar espaços
        </Link>
      </article>
    </main>
  );
}
