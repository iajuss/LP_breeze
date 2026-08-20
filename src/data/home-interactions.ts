import { articles } from "./editorial";
import { categories } from "./categories";
import { cities } from "./cities";
import { styles } from "./styles";
import { trustItems } from "./trust";

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=85`;

export type PhotoRailItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  imageAlt: string;
};

const categoryPhotos = [
  "1464366400600-7168b8af9bc3",
  "1511578314322-379afb476865",
  "1497366811353-6870744d04b2",
  "1497366754035-f200968a6e72",
  "1517245386807-bb43f82c33c4",
  "1521737604893-d14cc237f11d",
  "1527529482837-4698179dc6ce",
  "1531058020387-3be344556be6",
];

const cityPhotos = [
  "1519125323398-675f0ddb6308",
  "1483729558449-99ef09a8c325",
  "1529260830199-42c24126f198",
  "1522083165195-3424ed129620",
  "1500534314209-a25ddb2bd429",
  "1520301255226-bf5f144451c1",
  "1494526585095-c41746248156",
  "1526772662000-3f88f10405ff",
];

const editorialPhotos = [
  "1497366216548-37526070297c",
  "1519167758481-83f550bb49b3",
  "1507504031003-b417219a0fde",
];

export const categoryRailItems: PhotoRailItem[] = categories.map((category, index) => ({
  id: category.id,
  title: category.name,
  subtitle: "Encontre o cenário ideal",
  href: `/buscar?activity=${encodeURIComponent(category.name)}`,
  image: unsplash(categoryPhotos[index]),
  imageAlt: category.imageAlt,
}));

export const cityRailItems: PhotoRailItem[] = cities.map((city, index) => ({
  id: city.id,
  title: city.name,
  subtitle: city.state,
  href: `/espacos/${city.slug}`,
  image: unsplash(cityPhotos[index]),
  imageAlt: `Vista de ${city.name}`,
}));

export const editorialRailItems: PhotoRailItem[] = articles.map((article, index) => ({
  id: article.id,
  title: article.title,
  subtitle: "Guia Breeze",
  href: `/guias/${article.slug}`,
  image: unsplash(editorialPhotos[index]),
  imageAlt: `Imagem de apoio para o guia ${article.title}`,
}));

export const stylePanels = styles.map((style, index) => ({
  ...style,
  description: [
    "Luz aberta, horizonte e uma atmosfera que transforma encontros em experiências memoráveis.",
    "Verde, respiro e uma sensação acolhedora para celebrações que pedem tempo ao ar livre.",
    "Materiais aparentes, amplitude e personalidade para eventos com energia contemporânea.",
    "Detalhes que carregam memória e criam uma presença especial para cada ocasião.",
    "Uma tela em branco versátil para produzir, apresentar e criar do seu jeito.",
    "Brisa, paisagem e leveza para eventos que desejam sair da rotina.",
  ][index],
  image: unsplash([
    "1531058020387-3be344556be6",
    "1497250681960-ef046c08a56e",
    "1497366754035-f200968a6e72",
    "1544986581-efac024faf62",
    "1521737604893-d14cc237f11d",
    "1507525428034-b723cf961d3e",
  ][index]),
}));

export const corporateScenarios = [
  {
    id: "reuniao",
    label: "Reunião",
    headline: "Reuniões que fazem as ideias avançarem.",
    description: "Encontre um espaço com a estrutura, a privacidade e o ritmo que sua equipe precisa para decidir bem.",
    image: unsplash("1497366811353-6870744d04b2"),
    imageAlt: "Equipe reunida em um espaço contemporâneo",
  },
  {
    id: "workshop",
    label: "Workshop",
    headline: "Workshops que aproximam equipes.",
    description: "Dê espaço para criar, aprender e construir conexões fora da rotina do escritório.",
    image: unsplash("1517245386807-bb43f82c33c4"),
    imageAlt: "Pessoas participando de um workshop",
  },
  {
    id: "confraternizacao",
    label: "Confraternização",
    headline: "Confraternizações com o clima certo.",
    description: "Escolha um cenário que transforme um encontro de equipe em uma lembrança compartilhada.",
    image: unsplash("1492684223066-81342ee5ff30"),
    imageAlt: "Pessoas celebrando em uma confraternização",
  },
];

export const trustTimelineItems = trustItems.map((item, index) => ({
  ...item,
  number: String(index + 1).padStart(2, "0"),
  image: unsplash([
    "1519167758481-83f550bb49b3",
    "1529156069898-49953e39b3ac",
    "1500534314209-a25ddb2bd429",
  ][index]),
  imageAlt: [
    "Mesa preparada com detalhes de decoração",
    "Pessoas conversando em um ambiente de evento",
    "Detalhe de um espaço com arquitetura marcante",
  ][index],
}));
