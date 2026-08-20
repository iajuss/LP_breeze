# Breeze — Evolução Interativa da Homepage

**Status:** aguardando revisão da especificação  
**Data:** 20 de agosto de 2026  
**Escopo:** tornar as seções de descoberta e conversão da landing mais visuais e interativas, preservando a landing como aquisição exclusiva de demanda.

## Objetivo

Dar ritmo e variedade à navegação da homepage sem transformar cada bloco no mesmo tipo de carrossel. A experiência prioriza celular: arraste, controles visíveis, leitura em uma coluna e fotos com propósito editorial.

## Linguagem visual de fotografia

A fotografia equilibrará espaços e pessoas conforme o objetivo da seção:

- descoberta de lugar, estilo e cidade: arquitetura, ambientação, luz, paisagem e detalhes;
- corporativo: pessoas utilizando o espaço em reuniões, workshops e confraternizações;
- editorial: cenas e detalhes que acompanhem o assunto de cada artigo.

As imagens permanecem demonstrativas, sem alegar que retratam espaços cadastrados na plataforma. Cada área terá enquadramentos e temas distintos para evitar repetição visual.

## Padrões de interação

Todos os módulos interativos devem ter:

- controles clicáveis com área mínima de 44 px;
- arraste horizontal em telas sensíveis a toque quando houver sequência de cards;
- navegação por teclado quando a sequência muda conteúdo;
- estado ativo inequívoco, foco visível e texto alternativo apropriado;
- ausência de autoplay; a pessoa controla a mudança;
- transições breves, desabilitáveis via `prefers-reduced-motion`.

## Seções

### Por ocasião — trilho de descoberta

Os cards de ocasião deixam a grade estática e passam a um trilho fotográfico. No desktop, mostra um card principal e parte do próximo; no celular, usa rolagem horizontal com `scroll-snap`. Cada card conserva seu destino de busca e a foto comunica o tipo de evento.

### Explore por estilo — painel editorial

Os estilos tornam-se abas/linha de tempo compacta. A seleção troca um painel com foto ampla, nome do estilo, texto contextual e link de exploração. O painel evita uma nova grade densa e destaca a atmosfera do espaço.

### Como funciona — carrossel de jornada

O componente existente permanece como referência: uma etapa ativa por vez, foto, descrição, progresso, botões anterior/próximo, seleção direta, teclas direcionais e arraste.

### Para empresas — vitrine corporativa

O bloco se transforma em um painel visual de conversão. Três cenários — reunião, workshop e confraternização — alternam foto, chamada e descrição conforme o controle selecionado. O CTA de demanda continua encaminhando para a busca corporativa; não haverá conteúdo voltado a proprietários ou oferta.

### Escolha com clareza — linha do tempo de critérios

Os sinais de confiança se tornam uma linha do tempo de três critérios. Ao escolher um ponto, a explicação ativa ganha destaque e revela uma foto de detalhe do ambiente. O conteúdo demonstrativo continua identificado como demonstração, sem métricas ou depoimentos fictícios.

### Cidades — trilho geográfico

As cidades serão cards horizontais com imagem própria e estado/legenda. O próximo card parcialmente visível sugere continuidade no desktop; no celular, o gesto de arraste é a interação principal. Cada card conserva sua rota semântica.

### Guia Breeze — carrossel editorial

Os artigos passam a cartões com imagem, título, resumo e indicação de conteúdo. A seção permanece focada em leitura, por isso terá scroll horizontal suave em mobile e setas discretas no desktop, sem trocar o artigo automaticamente.

### Dúvidas frequentes

Permanece como acordeão, sem mudança estrutural.

## Arquitetura

- Extrair componentes clientes pequenos por padrão de interação, sem concentrar estado em `DemandSections`.
- Manter conteúdo em módulos de dados quando a seção já possuir dados; cada componente recebe dados por propriedades.
- Reutilizar uma base de trilho com controles apenas quando a API for realmente comum; painéis de estilo, corporativo e confiança conservam sua semântica própria.
- Preservar links atuais e a instrumentação de analytics já existente. Novos controles internos não acionam conversão; links de categoria/cidade e CTA corporativo continuam sendo os pontos de navegação.

## Critérios de aceite

- As seções citadas exibem diversidade visível de fotos e não repetem a imagem de hero de maneira predominante.
- Cada padrão responde adequadamente em 390 px, 768 px e desktop, sem overflow horizontal da página.
- Carrosséis e painéis são operáveis por mouse, toque e teclado quando aplicável.
- A página continua exclusivamente orientada a pessoas ou empresas que procuram espaços.
- FAQ permanece acessível e inalterado em sua interação principal.
- Testes cobrem mudança de etapa/painel e links permanecem corretos; validação inclui testes, tipos, lint e inspeção visual responsiva.
