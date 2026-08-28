/**
 * Valor de partida de cada espaço, exibido como "a partir de" nos cartões da
 * busca. São valores de referência, não contratos: nenhum preço comercial foi
 * acordado ainda — no Supabase todo espaço está com `pricing_label = 'Valor
 * sob consulta'` e `minimum_price` nulo. Confirme com o anfitrião antes de
 * tratar qualquer número aqui como preço fechado.
 *
 * Foram derivados de um modelo com os fatores que movem diária em São Paulo:
 *
 *   diária = R$ 1.000 + R$ 46 × capacidade^0,88 × bairro × estilo
 *
 * - a base fixa cobre limpeza, equipe e montagem, que não escalam com o tamanho;
 * - o expoente 0,88 dá ganho de escala: o valor por pessoa cai de ~R$ 55 num
 *   espaço de 60 lugares para ~R$ 20 num galpão de 450;
 * - bairro vai de 1,35 (Itaim, Pinheiros, Vila Madalena, Moema, Ibirapuera,
 *   Campo Belo) a 0,85 (Brás, Mooca, Penha, Luz, Casa Verde);
 * - estilo vai de 1,25 (Rooftop) e 1,18 (Jardim) a 0,88 (Industrial), porque
 *   espaço de celebração cobra mais por cabeça que espaço de produção.
 *
 * Ajuste um valor individualmente sempre que o combinado com o anfitrião
 * divergir do modelo. Espaço ausente deste mapa cai em "Valor sob consulta".
 */
export const venuePriceFrom: Record<string, number> = {
  "casa-jardim-pinheiros": 6000,
  "galpao-da-luz": 6400,
  "terraco-vila-madalena": 8500,
  "casa-vila-mariana": 4300,
  "salao-bela-vista": 5600,
  "sobrado-perdizes": 3300,
  "atelie-santana": 3900,
  "patio-casa-verde": 6300,
  "galeria-tatuape": 5000,
  "armazem-mooca": 8000,
  "jardim-moema": 6600,
  "estudio-santo-amaro": 3000,
  "espaco-pompeia": 7100,
  "villa-butanta": 6100,
  "casa-aclimacao": 4600,
  "estudio-berrini": 4600,
  "pavilhao-ibirapuera": 14500,
  "sala-consolacao": 2900,
  "armazem-bras": 8800,
  "jardim-analia": 5200,
  "casa-republica": 4700,
  "hub-leopoldina": 6100,
  "estacao-lapa": 7500,
  "espaco-bosque-saude": 6000,
  "auditorio-barra-funda": 7600,
  "casa-campo-belo": 5900,
  "pavilhao-penha": 7300,
  "sala-itaim": 3600,
};

export function priceFrom(slug: string): number | undefined {
  return venuePriceFrom[slug];
}

/** "R$ 6.000" sem depender de ICU, para servidor e cliente renderizarem igual. */
export function formatPriceFrom(value: number): string {
  return `R$ ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

/**
 * Rótulo exibido para o valor de partida, em texto puro. É o mesmo texto que
 * vai para `displayed_price` no lead, para o banco registrar o que a pessoa
 * de fato viu na tela.
 */
export function startingPriceLabel(slug: string): string {
  const value = priceFrom(slug);
  return value ? `A partir de ${formatPriceFrom(value)}` : "Valor sob consulta";
}
