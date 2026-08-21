import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const siteUrl = siteConfig.url;

export const homeMetadata: Metadata = {
  title: `${siteConfig.name} | Espaços para eventos em ${siteConfig.city}`,
  description: "Encontre espaços singulares para eventos, reuniões, festas e produções.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "pt_BR", url: siteUrl, siteName: siteConfig.name, title: `${siteConfig.name} | Onde boas ideias ganham cenário`, description: "Descubra espaços para eventos, reuniões, festas e produções." },
  twitter: { card: "summary_large_image", title: `${siteConfig.name} | Espaços para eventos`, description: "Onde boas ideias ganham cenário." },
};

export const organizationJsonLd = { "@context": "https://schema.org", "@type": "Organization", name: siteConfig.name, url: siteUrl, description: "Plataforma brasileira para descoberta de espaços de eventos em São Paulo." };
export const websiteJsonLd = { "@context": "https://schema.org", "@type": "WebSite", name: siteConfig.name, url: siteUrl, inLanguage: "pt-BR" };
