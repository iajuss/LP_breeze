"use client";

import { FormEvent, useState } from "react";
import { activityOptions, locationOptions } from "@/data/search-options";
import { interestRegions } from "@/data/regions";

type InterestFormProps = {
  venueSlug: string;
  defaultEventType: string;
  defaultLocation: string;
  defaultGuests: number;
  defaultInterestRegion?: string;
};

export function InterestForm({ venueSlug, defaultEventType, defaultLocation, defaultGuests, defaultInterestRegion }: InterestFormProps) {
  const [message, setMessage] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(undefined);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        venueSlug,
        name: form.get("name"), email: form.get("email"), phone: form.get("phone"),
        eventType: form.get("eventType"), neighborhood: form.get("neighborhood"), eventDate: form.get("eventDate") || undefined,
        regionInterest: form.get("regionInterest") || undefined,
        guestCount: Number(form.get("guestCount")), budget: form.get("budget") || undefined,
        marketingConsent: form.get("marketingConsent") === "on",
        source: new URLSearchParams(window.location.search).get("source") || undefined,
        campaign: new URLSearchParams(window.location.search).get("campaign") || undefined,
        referrer: document.referrer || undefined,
        utmSource: new URLSearchParams(window.location.search).get("utm_source") || undefined,
        utmMedium: new URLSearchParams(window.location.search).get("utm_medium") || undefined,
        utmCampaign: new URLSearchParams(window.location.search).get("utm_campaign") || undefined,
      }),
      });
      const body = await response.json().catch(() => ({})) as { error?: string; errors?: Record<string, string> };
      if (!response.ok) {
        setMessage(body.error || Object.values(body.errors ?? {})[0] || "Não foi possível enviar seus dados.");
        return;
      }
      setMessage("Enviamos um magic link para o seu e-mail. Abra-o para confirmar seu interesse.");
      event.currentTarget.reset();
    } catch {
      setMessage("Não conseguimos conectar ao atendimento agora. Tente novamente em instantes.");
    } finally {
      setSubmitting(false);
    }
  }

  return <form className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm" onSubmit={submit}>
    <div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Próximo passo</p><h2 className="mt-2 font-display text-3xl">Quero falar sobre este espaço</h2><p className="mt-2 text-sm text-[var(--muted)]">Deixe seus dados. Enviaremos um link seguro para confirmar o interesse e continuar a conversa.</p></div>
    <label className="text-sm font-semibold">Nome<input className="mt-1 min-h-11 w-full rounded-xl border border-[var(--border)] px-3 font-normal" name="name" required /></label>
    <label className="text-sm font-semibold">E-mail<input className="mt-1 min-h-11 w-full rounded-xl border border-[var(--border)] px-3 font-normal" name="email" required type="email" /></label>
    <label className="text-sm font-semibold">Telefone<input className="mt-1 min-h-11 w-full rounded-xl border border-[var(--border)] px-3 font-normal" name="phone" required type="tel" /></label>
    <label className="text-sm font-semibold">Ocasião<select className="mt-1 min-h-11 w-full rounded-xl border border-[var(--border)] px-3 font-normal" defaultValue={defaultEventType} name="eventType">{activityOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
    <label className="text-sm font-semibold">Localização<input className="mt-1 min-h-11 w-full rounded-xl border border-[var(--border)] px-3 font-normal" defaultValue={defaultLocation} list="interest-locations" name="neighborhood" required /><datalist id="interest-locations">{locationOptions.map((option) => <option key={option} value={option} />)}</datalist></label>
    <label className="text-sm font-semibold">Região de interesse<select className="mt-1 min-h-11 w-full rounded-xl border border-[var(--border)] px-3 font-normal" defaultValue={defaultInterestRegion || ""} name="regionInterest"><option value="">Sem preferência</option>{interestRegions.map((region) => <option key={region} value={region}>{region}</option>)}</select></label>
    <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold">Data<input className="mt-1 min-h-11 w-full rounded-xl border border-[var(--border)] px-3 font-normal" name="eventDate" type="date" /></label><label className="text-sm font-semibold">Pessoas<input className="mt-1 min-h-11 w-full rounded-xl border border-[var(--border)] px-3 font-normal" defaultValue={defaultGuests} min="1" name="guestCount" type="number" /></label></div>
    <label className="text-sm font-semibold">Faixa de orçamento (opcional)<input className="mt-1 min-h-11 w-full rounded-xl border border-[var(--border)] px-3 font-normal" name="budget" placeholder="Ex.: até R$ 10 mil" /></label>
    <label className="flex gap-2 text-sm text-[var(--muted)]"><input name="marketingConsent" type="checkbox" /> Aceito receber novidades da Arcora.</label>
    <p className="text-xs text-[var(--muted)]">Usamos seus dados para atender esta solicitação. Consulte nossa <a className="underline" href="/privacidade">política de privacidade</a>.</p>
    {message ? <p className="rounded-xl bg-[var(--secondary)] p-3 text-sm" role="status">{message}</p> : null}
    <button className="min-h-12 rounded-xl bg-[var(--primary)] px-5 font-semibold text-white disabled:opacity-60" disabled={submitting} type="submit">{submitting ? "Enviando..." : "Enviar e receber magic link"}</button>
  </form>;
}
