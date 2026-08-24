"use client";

import { FormEvent, useState } from "react";
import { activityOptions, locationOptions } from "@/data/search-options";
import { interestRegions } from "@/data/regions";
import { DesktopDatePicker } from "@/components/search/desktop-date-picker";
import { ArcoraSelect } from "@/components/ui/arcora-select";

type InterestFormProps = {
  venueSlug: string;
  defaultEventType: string;
  defaultLocation: string;
  defaultGuests: number;
  defaultInterestRegion?: string;
};

type FormMessage = {
  kind: "error" | "success";
  text: string;
};

export function InterestForm({ venueSlug, defaultEventType, defaultLocation, defaultGuests, defaultInterestRegion }: InterestFormProps) {
  const [message, setMessage] = useState<FormMessage>();
  const [submitting, setSubmitting] = useState(false);
  const [eventDate, setEventDate] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSubmitting(true);
    setMessage(undefined);
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        venueSlug,
        name: form.get("name"), email: form.get("email"), phone: form.get("phone"),
        eventType: form.get("eventType"), neighborhood: form.get("neighborhood"), residentNeighborhood: form.get("residentNeighborhood"), eventDate: eventDate || undefined,
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
        setMessage({ kind: "error", text: body.error || Object.values(body.errors ?? {})[0] || "Não foi possível enviar seus dados." });
        return;
      }
      setMessage({ kind: "success", text: "Enviamos um link de confirmação para o seu e-mail. Abra-o para confirmar seu interesse." });
      formElement.reset();
      setEventDate("");
    } catch {
      setMessage({ kind: "error", text: "Não conseguimos conectar ao atendimento agora. Tente novamente em instantes." });
    } finally {
      setSubmitting(false);
    }
  }

  return <form className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm" onSubmit={submit}>
    <div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Próximo passo</p><h2 className="mt-2 font-display text-3xl">Quero falar sobre este espaço</h2><p className="mt-2 text-sm text-[var(--muted)]">Deixe seus dados. Enviaremos um link seguro para confirmar o interesse e continuar a conversa.</p></div>
    <label className="text-sm font-semibold">Nome<input className="mt-1 min-h-11 w-full rounded-xl border border-[var(--border)] px-3 font-normal" name="name" required /></label>
    <label className="text-sm font-semibold">E-mail<input className="mt-1 min-h-11 w-full rounded-xl border border-[var(--border)] px-3 font-normal" name="email" required type="email" /></label>
    <label className="text-sm font-semibold">Telefone<input className="mt-1 min-h-11 w-full rounded-xl border border-[var(--border)] px-3 font-normal" name="phone" required type="tel" /></label>
    <div className="text-sm font-semibold">Ocasião<ArcoraSelect label="Ocasião" name="eventType" options={activityOptions} defaultValue={defaultEventType} /></div>
    <label className="text-sm font-semibold">Onde quer realizar?<input className="mt-1 min-h-11 w-full rounded-xl border border-[var(--border)] px-3 font-normal" defaultValue={defaultLocation} list="interest-locations" name="neighborhood" required /><datalist id="interest-locations">{locationOptions.map((option) => <option key={option} value={option} />)}</datalist></label>
    <div className="text-sm font-semibold"><label htmlFor="resident-neighborhood">Em que bairro você mora?</label><input aria-describedby="resident-neighborhood-help" className="mt-1 min-h-11 w-full rounded-xl border border-[var(--border)] px-3 font-normal" id="resident-neighborhood" list="resident-neighborhoods" name="residentNeighborhood" placeholder="Ex.: Moema" required /><datalist id="resident-neighborhoods">{locationOptions.map((option) => <option key={option} value={option} />)}</datalist><span className="mt-1 block text-xs font-normal text-[var(--muted)]" id="resident-neighborhood-help">Usamos esta informação para entender de onde vem a demanda.</span></div>
    <div className="text-sm font-semibold">Região de interesse<ArcoraSelect label="Região de interesse" name="regionInterest" options={[{ label: "Sem preferência", value: "" }, ...interestRegions]} defaultValue={defaultInterestRegion} /></div>
    <div className="grid gap-3 sm:grid-cols-2"><div className="text-sm font-semibold">Data<DesktopDatePicker ariaLabel="Data" className="min-h-11 w-full rounded-xl border border-[var(--border)] px-3 pr-9 font-normal focus:border-[var(--primary)] focus:outline-none" menuClassName="left-0 min-w-[17rem]" onChange={setEventDate} value={eventDate} /></div><label className="text-sm font-semibold">Pessoas<input className="mt-1 min-h-11 w-full rounded-xl border border-[var(--border)] px-3 font-normal" defaultValue={defaultGuests} min="1" name="guestCount" type="number" /></label></div>
    <label className="text-sm font-semibold">Faixa de orçamento (opcional)<input className="mt-1 min-h-11 w-full rounded-xl border border-[var(--border)] px-3 font-normal" name="budget" placeholder="Ex.: até R$ 10 mil" /></label>
    <label className="flex gap-2 text-sm text-[var(--muted)]"><input name="marketingConsent" type="checkbox" /> Aceito receber novidades da Arcora.</label>
    <p className="text-xs text-[var(--muted)]">Usamos seus dados para atender esta solicitação. Consulte nossa <a className="underline" href="/privacidade">política de privacidade</a>.</p>
    {message ? <div className="rounded-xl border border-[var(--border)] bg-[var(--secondary)] p-4 text-sm" role="status">{message.kind === "success" ? <p className="font-semibold text-[var(--primary)]">Pedido enviado</p> : null}<p className={message.kind === "success" ? "mt-1" : undefined}>{message.text}</p></div> : null}
    <button className="min-h-12 rounded-xl bg-[var(--primary)] px-5 font-semibold text-white disabled:opacity-60" disabled={submitting} type="submit">{submitting ? "Enviando..." : "Enviar link de confirmação"}</button>
  </form>;
}
