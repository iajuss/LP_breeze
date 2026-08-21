export const openSearchEvent = "arcora:open-search";

export type SearchValues = {
  activity: string;
  location: string;
  date: string;
  guests: number;
};

export type SearchErrors = Partial<Record<keyof SearchValues, string>>;

export const emptySearchValues: SearchValues = {
  activity: "",
  location: "",
  date: "",
  guests: 0,
};
