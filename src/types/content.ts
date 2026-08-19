export type AnalyticsEvent =
  | "search_started"
  | "search_submitted"
  | "activity_selected"
  | "location_selected"
  | "date_selected"
  | "guest_count_selected"
  | "venue_card_clicked"
  | "category_clicked"
  | "city_clicked"
  | "corporate_cta_clicked"
  | "signup_clicked";

export type Venue = {
  id: string;
  name: string;
  city: string;
  region: string;
  capacity: number;
  category: string;
  styles: string[];
  image: string;
  imageAlt: string;
  rating?: number;
  priceFrom?: number;
  isDemo: true;
};

export type Category = { id: string; name: string; slug: string; image: string; imageAlt: string };
export type StyleCollection = { id: string; name: string; slug: string; image: string; imageAlt: string };
export type City = { id: string; name: string; state: string; slug: string; image?: string; imageAlt?: string };
export type Article = { id: string; title: string; excerpt: string; slug: string; image?: string; imageAlt?: string };
export type FaqItem = { id: string; question: string; answer: string };
export type TrustItem = { id: string; title: string; description: string; isDemo: true; source?: string };
