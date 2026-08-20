# Breeze — estado da implementação

## Objetivo entregue

Landing page da **Breeze**, um marketplace de locação de espaços para eventos, construída exclusivamente para geração de demanda. A proposta central é: **“Onde boas ideias ganham cenário.”**

O projeto não possui fluxos de captação de anfitriões, painel administrativo, pagamento ou reservas reais nesta etapa.

## O que foi implementado

- Página inicial responsiva com navegação, hero e busca de espaços.
- Busca por local, data e número de convidados, direcionando para `/buscar` com os filtros preenchidos.
- Página `/buscar` com resultados demonstrativos coerentes, filtros clicáveis por ocasião, cidade, estilo e capacidade, além de sugestões quando não há correspondência exata.
- Interface de busca adequada para desktop e mobile, incluindo seletor de convidados e diálogo mobile com textos de alto contraste, ações explícitas de fechar/cancelar e reinício seguro do fluxo ao reabrir.
- Descoberta de espaços por ocasião, estilo e cidades, além de cards de espaços em destaque.
- Trilhos fotográficos circulares para ocasiões, cidades e guias Breeze, com navegação nos dois sentidos, controles visuais consistentes e retorno contínuo ao início.
- Explorador de estilos com painéis visuais, vitrine interativa para empresas e linha do tempo visual que explica os critérios de escolha.
- Fotografias de apoio distribuídas de acordo com o objetivo de cada seção, equilibrando espaços, pessoas e detalhes de eventos.
- Seções de como funciona, soluções para empresas, confiança, conteúdo editorial, FAQ e rodapé.
- Seções em largura total, com o conteúdo interno preservando uma medida de leitura confortável e altura mínima de viewport no desktop.
- Revisão mobile-first: hero usa a altura dinâmica da tela, tipografia se adapta a telas estreitas, cartões de ocasião não extrapolam a largura e o carrossel de espaços tem rolagem interna com snap.
- Header fixo que ganha camada translúcida e desfoque durante a rolagem.
- Feedback de hover/foco para controles e transição fluida de abertura e fechamento no FAQ.
- Seletor de ocasião desktop personalizado, com menu verde aberto para baixo, fechamento por `Esc` ou clique externo e campo de convidados sem setas nativas.
- Campo de data desktop com calendário Breeze aberto para baixo, entrada manual no formato `dd/mm/aaaa` e barras automáticas; todos os valores da busca ficam alinhados aos respectivos rótulos.
- Contraste explícito nos controles de busca sobre fundo branco, em desktop e mobile.
- Ações de favoritos e eventos analíticos estruturados no cliente.
- SEO técnico: metadados, Open Graph, Twitter card, JSON-LD, `robots.txt` e sitemap.
- Testes unitários e de componentes para busca, SEO, conteúdo, analytics, cards e homepage.

## Arquitetura

- **Framework:** Next.js 15 com App Router e TypeScript.
- **Estilos:** Tailwind CSS e design responsivo próprio.
- **Dados de demonstração:** `src/data/`.
- **Componentes principais:** `src/components/home/`, `src/components/search/`, `src/components/layout/` e `src/components/ui/`.
- **Rota de resultado de busca:** `src/app/buscar/page.tsx`.

## Como executar localmente

```powershell
npm install
npm run dev
```

Abra `http://localhost:3000`.

Se o Next apresentar erro de cache relacionado a `.next`, remova somente esse diretório gerado e inicie novamente:

```powershell
Remove-Item -LiteralPath ".next" -Recurse -Force
npm run dev
```

## Como validar

```powershell
npm run test
npx tsc --noEmit
npm run lint
npm run build
```

Para o teste de navegador, instale o navegador headless do Playwright e execute:

```powershell
npx playwright install --only-shell chromium
npm run test:e2e
```

## Situação de validação

Em 20 de agosto de 2026, passaram:

- 34 testes unitários e de componentes em 10 arquivos;
- 9 testes E2E executados em desktop e mobile (mais uma regra exclusivamente desktop ignorada no perfil mobile);
- validação de tipos TypeScript;
- lint;
- build de produção do Next.js.

## Pendências para produção

- Definir o domínio definitivo para substituir o canônico de exemplo (`https://breeze.example`).
- Conectar busca, favoritos e disponibilidade a APIs/dados reais.
- Substituir imagens e conteúdo demonstrativos pelos ativos e textos finais.
- Três alertas de alta severidade permanecem em dependências internas do Next 15; a correção disponível exige migração principal para Next 16.3.1. Não aplicar `npm audit fix --force` sem planejar e validar essa migração.
