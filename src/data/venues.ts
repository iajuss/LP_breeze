import type { Venue } from "@/types/content";

export const venues: Venue[] = [
  { id: "casa-jardim", name: "Casa Jardim Pinheiros", city: "São Paulo", region: "Pinheiros", capacity: 120, category: "Festas", styles: ["Jardim", "Moderno"], image: "/images/venues/casa-jardim.jpg", imageAlt: "Casa com jardim para eventos", rating: 4.8, priceFrom: 3200, isDemo: true },
  { id: "galpao-luz", name: "Galpão da Luz", city: "São Paulo", region: "Luz", capacity: 300, category: "Produções", styles: ["Industrial", "Estúdio"], image: "/images/venues/galpao-luz.jpg", imageAlt: "Galpão industrial amplo", rating: 4.7, priceFrom: 5800, isDemo: true },
  { id: "rooftop-lapa", name: "Rooftop Lapa", city: "Rio de Janeiro", region: "Lapa", capacity: 180, category: "Eventos corporativos", styles: ["Rooftop", "Moderno"], image: "/images/venues/rooftop-lapa.jpg", imageAlt: "Rooftop com vista urbana", rating: 4.9, priceFrom: 4500, isDemo: true },
  { id: "casa-pampulha", name: "Casa Pampulha", city: "Belo Horizonte", region: "Pampulha", capacity: 90, category: "Casamentos", styles: ["Histórico", "Jardim"], image: "/images/venues/casa-pampulha.jpg", imageAlt: "Casa histórica cercada por verde", rating: 4.6, priceFrom: 2800, isDemo: true },
];
