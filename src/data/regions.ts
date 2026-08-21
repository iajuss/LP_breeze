export const interestRegions = ["Centro", "Norte", "Sul", "Leste", "Oeste"] as const;

export type InterestRegion = (typeof interestRegions)[number];

export function isInterestRegion(value: string | undefined): value is InterestRegion {
  return Boolean(value && interestRegions.includes(value as InterestRegion));
}
