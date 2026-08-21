export const activityOptions = [
  "Festa",
  "Casamento",
  "Evento corporativo",
  "Reunião",
  "Workshop",
  "Produção",
] as const;

export const locationOptions = [
  "São Paulo, SP",
  "Pinheiros, São Paulo, SP",
  "Vila Madalena, São Paulo, SP",
  "Vila Mariana, São Paulo, SP",
  "Luz, São Paulo, SP",
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
