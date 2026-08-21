export type SearchState = {
  eventType: string;
  neighborhood: string;
  date: string;
  guestCount: number;
  budget?: string;
};

export type AcquisitionContext = {
  source?: string;
  campaign?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};
