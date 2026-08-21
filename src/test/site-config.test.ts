import { expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { homeMetadata } from "@/lib/seo";

it("centralizes Arcora as the temporary public brand", () => {
  expect(siteConfig).toMatchObject({ name: "Arcora", city: "São Paulo", state: "SP" });
  expect(homeMetadata.title).toContain(siteConfig.name);
});
