import type { JSX } from "react";
import { FeaturedVenues } from "@/components/home/featured-venues";
import { Hero } from "@/components/home/hero";
import { Header } from "@/components/layout/header";

export default function HomePage(): JSX.Element {
  return <><Header /><main><Hero /><FeaturedVenues /></main></>;
}
