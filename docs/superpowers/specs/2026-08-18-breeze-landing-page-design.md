# Breeze — Design da Landing Page

**Status:** aguardando aprovação da especificação  
**Data:** 18 de agosto de 2026  
**Escopo:** landing page responsiva para o marketplace brasileiro Breeze

## 1. Objetivo

A Breeze é uma plataforma para pessoas e empresas encontrarem o espaço ideal para um evento. Esta landing é exclusivamente de aquisição de demanda: deve levar visitantes a iniciar uma busca por espaço e não contém funil, CTA ou proposta de conversão para proprietários.

O princípio de produto é: **inspiração visual + descoberta + confiança + facilidade de contratação**. Cada elemento deve ajudar a pessoa a imaginar seu evento no espaço e a dar o próximo passo.

## 2. Público e conversões

### Público prioritário: quem busca um espaço

Empresas, agências, produtores, RH, marketing, noivos, famílias, fotógrafos e produtores audiovisuais. Eles precisam filtrar por ocasião, local, data, capacidade, estilo e, quando disponível, faixa de preço.

**Conversão principal:** iniciar a busca de espaços.

### Segmento complementar: demanda corporativa

Empresas, agências, RH e marketing podem ter necessidades de maior complexidade, como confraternizações, treinamentos, lançamentos, workshops e experiências de marca.

**Conversão complementar:** iniciar uma busca com contexto corporativo ou solicitar atendimento especializado, quando esse fluxo estiver disponível.

## 3. Posicionamento e narrativa

A Breeze é um marketplace contemporâneo brasileiro de lugares extraordinários para eventos. Não deve parecer um clone de hospedagem, um catálogo de buffet, um portal antigo de eventos nem uma landing SaaS genérica.

### Copy de abertura

> Onde boas ideias ganham cenário.

> Encontre espaços singulares para eventos, reuniões, festas e produções.

Essa linguagem equilibra leveza e desejo sem prometer uma mecânica comercial ainda não confirmada, como reserva instantânea ou preço garantido.

## 4. Arquitetura da página

1. **Header:** marca, Explorar espaços, Como funciona, Para empresas e Entrar.
2. **Hero + busca:** fotografia protagonista, mensagem da marca e início de busca.
3. **Ocasiões:** atalhos para festas, casamentos, corporativo, reuniões, workshops, produções, ensaios e lançamentos.
4. **Espaços que inspiram:** seleção visual de locais com dados comparáveis.
5. **Climas e estilos:** descoberta por rooftop, jardim, industrial, histórico, estúdio e outros estilos.
6. **Como funciona:** descobrir, comparar, conversar e reservar/solicitar disponibilidade conforme o modelo comercial final.
7. **Para empresas:** soluções para confraternizações, lançamentos, workshops, reuniões, treinamentos, produções e experiências de marca.
8. **Confiança:** estrutura para dados e depoimentos reais; no protótipo, todo conteúdo sem fonte será identificado como demonstração.
9. **Cidades:** entradas para exploração e futuras páginas de SEO.
10. **Editorial e FAQ:** conteúdo de decisão e respostas a objeções.
11. **Footer:** navegação da plataforma, tipos de evento, cidades, empresa e legal.

## 5. Design system

### Tipografia

- **DM Serif Display:** títulos e pontos editoriais; cria personalidade sem comprometer a leitura em português.
- **Manrope:** navegação, campos, rótulos, botões e texto corrido; mantém clareza em interfaces densas.

Fontes serão carregadas de maneira otimizada, com fallback de sistema e pesos estritamente necessários.

### Tokens de cor

| Token | Valor | Uso |
| --- | --- | --- |
| `background` | `#F7F4EF` | fundo marfim quente |
| `surface` | `#FFFFFF` | superfícies e busca |
| `foreground` | `#1B2825` | conteúdo principal |
| `muted` | `#6D7773` | conteúdo secundário |
| `primary` | `#174C43` | CTAs e elementos de confiança |
| `secondary` | `#DDE7DD` | áreas suaves |
| `accent` | `#D9764E` | destaque pontual |
| `border` | `#D9D8D2` | divisórias |
| `success` | `#2D765A` | confirmação |
| `warning` | `#B87926` | alerta |
| `destructive` | `#B34842` | erro |

Texto e controles deverão atender contraste WCAG 2.2 AA nos respectivos contextos.

### Layout e superfície

- Grid de 12 colunas no desktop, 6 no tablet e 4 no mobile.
- Contêiner com largura máxima de 1280 px.
- Escala de espaçamento baseada em 4 px, com bastante área vazia entre blocos.
- Raios de 16 px nos cards e 12 px nos controles.
- Elevação mínima: bordas sutis; sombra e movimento apenas em interações.

## 6. Hero e busca

### Hero

O hero usa fotografia de alta qualidade de um espaço em uso. Deve haver contraste local, por sobreposição ou recorte, para manter a headline e a busca legíveis sem esconder a imagem sob um filtro pesado.

### Busca no desktop

A barra de busca fica visualmente ligada ao hero e apresenta, nessa ordem:

1. **O que você está planejando?** — seleção de ocasião.
2. **Onde?** — autocomplete de cidade, bairro ou região.
3. **Quando?** — calendário, com opção `Ainda não sei a data`.
4. **Quantas pessoas?** — contador e indicação de capacidade aproximada.
5. **Buscar espaços** — CTA principal.

Os rótulos são persistentes. Cada campo possui foco visível, suporte a teclado, label programático e mensagem de erro próxima quando aplicável.

### Busca no mobile

O hero exibe um CTA claro. Ao tocá-lo, abre-se um bottom sheet sequencial:

1. Ocasião;
2. Local;
3. Data ou `a definir`;
4. Pessoas;
5. Revisão e envio.

O usuário pode retornar de etapa sem perder respostas. A ação principal fica fixa na área inferior; todas as áreas acionáveis têm pelo menos 44 × 44 px.

## 7. Descoberta de espaços

### Ocasiões

Cards fotográficos de grande formato para: Festas, Casamentos, Eventos corporativos, Reuniões, Workshops, Produções, Ensaios e Lançamentos. O texto sobre imagem sempre recebe base de contraste suficiente.

### Espaços que inspiram

No desktop, uma grade editorial com primeiro item maior quebra a repetição visual. No mobile, a lista é rolável horizontalmente, sem esconder a próxima ação.

Cada card contém:

- foto com dimensão reservada;
- botão de favorito com nome acessível;
- nome;
- região e cidade;
- capacidade;
- tipo ou categoria;
- avaliação somente com origem definida;
- preço `a partir de` somente se esse dado fizer parte do modelo real.

### Climas e estilos

Um mosaico de imagens de tamanhos diversos permite explorar rooftop, jardim, industrial, histórico, minimalista, estúdio, praia, moderno e ao ar livre. É uma via de descoberta, não um conjunto de filtros obrigatórios.

## 8. Conteúdo institucional e conversão de demanda

### Como funciona

1. **Descubra:** pesquise a partir do que seu evento precisa.
2. **Compare:** veja fotos, capacidade, características e condições.
3. **Converse:** solicite disponibilidade ou orçamento diretamente pela plataforma.

O terceiro passo deve se manter configurável até haver definição de reserva, pagamento e mediação da Breeze.

### Para empresas

Headline: **Seu próximo evento corporativo começa pelo lugar certo.**

Apresenta casos de uso de empresa e CTA `Encontrar espaço para minha empresa`, encaminhando para um fluxo de busca ou contato B2B conforme a rota disponível.

### Confiança e depoimentos

Não serão publicados números, avaliações ou depoimentos fictícios como fatos. A camada de dados terá campos explícitos para origem e estado de demonstração. Sem dados reais, a seção comunica o processo, suporte e critérios de curadoria sem inventar métricas.

## 9. Conteúdo, cidades e SEO

As cidades iniciais planejadas são São Paulo, Rio de Janeiro, Belo Horizonte, Brasília, Curitiba, Florianópolis, Porto Alegre e Campinas. Cada card deve poder apontar para URLs semânticas futuras, por exemplo:

- `/espacos/sao-paulo`
- `/espacos/casamento/sao-paulo`
- `/espacos/evento-corporativo/sao-paulo`

A seção editorial abre caminho para conteúdos como escolha de espaço corporativo, custo de locação, capacidade e checklist de casamento. Deve evitar repetição artificial de palavras-chave.

Fundamentos técnicos: título, descrição, canonical, Open Graph, Twitter Cards, hierarquia semântica e dados estruturados `Organization` e `WebSite`. `FAQPage` somente será inserido se refletir as perguntas e respostas publicadas e for compatível com as regras vigentes dos buscadores.

## 10. Interação, estados e analytics

Componentes críticos suportam estado default, hover, focus, pressed, disabled, loading, vazio e erro recuperável.

Microinterações são discretas: zoom e elevação leves de imagem em hover, transições curtas em menus e acordeon. `prefers-reduced-motion` remove ou reduz as animações.

Uma camada de analytics independente de fornecedor deve expor os eventos:

- `search_started`
- `search_submitted`
- `activity_selected`
- `location_selected`
- `date_selected`
- `guest_count_selected`
- `venue_card_clicked`
- `category_clicked`
- `city_clicked`
- `corporate_cta_clicked`
- `signup_clicked`

Nenhum evento deve depender diretamente de GA4, PostHog, Mixpanel ou Segment.

## 11. Acessibilidade, responsividade e desempenho

- HTML semântico, um único `h1` e sequência lógica de headings.
- Labels visíveis e programáticos; ARIA somente quando HTML nativo não cobrir a necessidade.
- Navegação completa por teclado, foco contrastado e alternativa textual para imagens relevantes.
- Interface construída mobile-first, com navegação mobile própria em vez de menu desktop comprimido.
- Imagens com dimensão declarada, carregamento preguiçoso fora da dobra e prioridade apenas na imagem LCP.
- Dependências reduzidas, JavaScript limitado a interações necessárias e sem animações pesadas.
- Respeito a LCP, CLS e INP durante a implementação e inspeção visual em desktop, tablet e mobile.

## 12. Dados de demonstração e arquitetura de conteúdo

Os dados de espaços, categorias, estilos, cidades, artigos, FAQs, depoimentos e sinais de confiança ficam fora dos componentes de apresentação, em módulos substituíveis por API ou CMS. Cada dado que não represente informação real deve declarar um marcador de demonstração na origem.

## 13. Critérios de aceite

- A busca é a ação mais evidente da página e funciona em desktop e mobile.
- A experiência é visualmente própria da Breeze e não reproduz identidade, conteúdo ou layout distintivo dos benchmarks.
- Todas as CTAs de aquisição de demanda possuem destino ou comportamento coerente.
- Conteúdo fictício não se passa por depoimento, avaliação, preço ou métrica real.
- Navegação, formulário e componentes críticos seguem os requisitos de acessibilidade definidos.
- Estrutura para SEO e analytics está separada de fornecedores e pronta para evolução.
- Não há CTA, formulário, navegação ou mensagem voltada a proprietários ou anúncio de espaços.
- A página passa por verificação de build, testes de comportamento relevantes e inspeção visual responsiva antes da conclusão.
