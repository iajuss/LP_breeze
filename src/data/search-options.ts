import { styles } from "./styles";

export const activityOptions = [
  "Festa",
  "Casamento",
  "Evento corporativo",
  "Reunião",
  "Workshop",
  "Produção",
  "Ensaio",
  "Lançamento",
] as const;

export const locationOptions = [
  "São Paulo, SP",
  "Bela Vista, São Paulo, SP",
  "Casa Verde, São Paulo, SP",
  "Luz, São Paulo, SP",
  "Moema, São Paulo, SP",
  "Mooca, São Paulo, SP",
  "Perdizes, São Paulo, SP",
  "Pinheiros, São Paulo, SP",
  "Santana, São Paulo, SP",
  "Santo Amaro, São Paulo, SP",
  "Tatuapé, São Paulo, SP",
  "Vila Madalena, São Paulo, SP",
  "Vila Mariana, São Paulo, SP",
] as const;

const normalize = (value: string) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase("pt-BR")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

export function canonicalLocation(value: string): string | undefined {
  return locationOptions.find((option) => normalize(option) === normalize(value));
}

// Os cartoes de atalho da home exibem o plural ("Festas"), mas o filtro trabalha
// com o singular. O corte de "s" final do normalize nao resolve plurais em
// ao/oes, entao a correspondencia precisa ser explicita.
const activityPlurals: Record<string, string> = {
  "Festas": "Festa",
  "Casamentos": "Casamento",
  "Eventos corporativos": "Evento corporativo",
  "Reuniões": "Reunião",
  "Workshops": "Workshop",
  "Produções": "Produção",
  "Ensaios": "Ensaio",
  "Lançamentos": "Lançamento",
};

export function canonicalActivity(value: string): string | undefined {
  const direct = activityOptions.find((option) => normalize(option) === normalize(value));
  if (direct) return direct;
  return Object.entries(activityPlurals).find(([plural]) => normalize(plural) === normalize(value))?.[1];
}

export function canonicalStyle(value: string): string | undefined {
  return styles.find((style) => normalize(style.name) === normalize(value) || normalize(style.slug) === normalize(value))?.name;
}
