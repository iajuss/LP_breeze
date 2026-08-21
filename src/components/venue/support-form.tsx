"use client";

import { FormEvent, useState } from "react";

export function SupportForm({ venueSlug }: { venueSlug: string }) {
  const [message, setMessage] = useState<string>();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/support-inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ venueSlug, question: form.get("question"), contactEmail: form.get("email") }) });
    setMessage(response.ok ? "Pergunta recebida. Retornaremos pelo e-mail informado." : "Não foi possível enviar sua pergunta agora.");
    if (response.ok) event.currentTarget.reset();
  }
  return <form className="mt-8 rounded-3xl bg-white p-6" onSubmit={submit}><h2 className="font-display text-3xl">Ainda tem uma dúvida?</h2><p className="mt-2 text-sm text-[var(--muted)]">Pergunte sobre o espaço ou sobre como funciona o atendimento.</p><label className="mt-4 block text-sm font-semibold">Sua pergunta<textarea className="mt-1 min-h-28 w-full rounded-xl border border-[var(--border)] p-3 font-normal" minLength={10} name="question" required /></label><label className="mt-3 block text-sm font-semibold">E-mail para resposta<input className="mt-1 min-h-11 w-full rounded-xl border border-[var(--border)] px-3 font-normal" name="email" required type="email" /></label><button className="mt-4 min-h-11 rounded-xl border border-[var(--primary)] px-4 font-semibold text-[var(--primary)]" type="submit">Enviar pergunta</button>{message ? <p className="mt-3 text-sm" role="status">{message}</p> : null}</form>;
}
