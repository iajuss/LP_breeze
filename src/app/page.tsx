import type { JSX } from "react";
import { FeaturedVenues } from "@/components/home/featured-venues";
import { Hero } from "@/components/home/hero";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DemandSections } from "@/components/home/demand-sections";

export default function HomePage(): JSX.Element {
  return <><Header /><main><Hero /><DemandSections /><FeaturedVenues /></main><Footer /></>;
}
