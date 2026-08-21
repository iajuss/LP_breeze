import Link from "next/link";
import { faqs } from "@/data/faqs";

export default function HelpPage() {
  return <main className="min-h-screen bg-[var(--secondary)] px-5 py-14"><section className="mx-auto max-w-3xl"><Link className="text-sm font-semibold text-[var(--primary)]" href="/">← Início</Link><h1 className="mt-8 font-display text-5xl">Como podemos ajudar?</h1><p className="mt-4 text-[var(--muted)]">Perguntas frequentes sobre encontrar e solicitar um espaço em São Paulo.</p><div className="mt-8 space-y-4">{faqs.map((faq) => <details className="rounded-2xl bg-white p-5" key={faq.id}><summary className="cursor-pointer font-semibold">{faq.question}</summary><p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{faq.answer}</p></details>)}</div></section></main>;
}
