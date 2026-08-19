import type { JSX } from "react";
import { FeaturedVenues } from "@/components/home/featured-venues";
import { Hero } from "@/components/home/hero";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DemandSections } from "@/components/home/demand-sections";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export default function HomePage(): JSX.Element {
  return <><script dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} type="application/ld+json" /><script dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} type="application/ld+json" /><Header /><main><Hero /><DemandSections /><FeaturedVenues /></main><Footer /></>;
}
