# Breeze — estado da implementação

## Objetivo entregue

Landing page da **Breeze**, um marketplace de locação de espaços para eventos, construída exclusivamente para geração de demanda. A proposta central é: **“Onde boas ideias ganham cenário.”**

O projeto não possui fluxos de captação de anfitriões, painel administrativo, pagamento ou reservas reais nesta etapa.

## O que foi implementado

- Página inicial responsiva com navegação, hero e busca de espaços.
- Busca por local, data e número de convidados, direcionando para `/buscar` com os filtros preenchidos.
- Interface de busca adequada para desktop e mobile, incluindo seletor de convidados e diálogo mobile.
- Descoberta de espaços por ocasião, estilo e cidades, além de cards de espaços em destaque.
- Seções de como funciona, soluções para empresas, confiança, conteúdo editorial, FAQ e rodapé.
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

Para o teste de navegador, instale o Chromium do Playwright e execute:

```powershell
npx playwright install chromium
npm run test:e2e
```

## Situação de validação

Em 19 de agosto de 2026, passaram:

- 8 testes em 7 arquivos;
- validação de tipos TypeScript;
- lint;
- build de produção do Next.js.

O teste E2E depende da instalação local do navegador Chromium pelo Playwright.

## Pendências para produção

- Definir o domínio definitivo para substituir o canônico de exemplo (`https://breeze.example`).
- Conectar busca, favoritos e disponibilidade a APIs/dados reais.
- Substituir imagens e conteúdo demonstrativos pelos ativos e textos finais.
- Revisar as dependências apontadas por `npm audit`; não aplicar `npm audit fix --force` sem avaliar os upgrades.
