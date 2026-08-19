import { homeMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

it("describes Breeze as a Portuguese event-space discovery product", () => {
  expect(homeMetadata.title).toMatch(/Breeze/);
  expect(homeMetadata.description).toMatch(/espaços/i);
  expect(organizationJsonLd["@type"]).toBe("Organization");
  expect(websiteJsonLd["@type"]).toBe("WebSite");
});
