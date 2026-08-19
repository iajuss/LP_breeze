import type { Metadata } from "next";

export const siteUrl = "https://breeze.example";

export const homeMetadata: Metadata = {
  title: "Breeze | Espaços singulares para eventos",
  description: "Encontre espaços singulares para eventos, reuniões, festas e produções.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "pt_BR", url: siteUrl, siteName: "Breeze", title: "Breeze | Onde boas ideias ganham cenário", description: "Descubra espaços para eventos, reuniões, festas e produções." },
  twitter: { card: "summary_large_image", title: "Breeze | Espaços para eventos", description: "Onde boas ideias ganham cenário." },
};

export const organizationJsonLd = { "@context": "https://schema.org", "@type": "Organization", name: "Breeze", url: siteUrl, description: "Plataforma brasileira para descoberta de espaços de eventos." };
export const websiteJsonLd = { "@context": "https://schema.org", "@type": "WebSite", name: "Breeze", url: siteUrl, inLanguage: "pt-BR" };
