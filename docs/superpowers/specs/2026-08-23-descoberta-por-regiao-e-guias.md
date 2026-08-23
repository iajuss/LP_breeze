# Descoberta por região e guias — especificação

## Objetivo

Permitir que uma pessoa expresse, de forma clara e acessível, a região de São Paulo em que realizaria um evento. Essa preferência deve acompanhá-la da página inicial ao formulário de interesse e ser gravada apenas quando o pedido for confirmado. A mesma entrega corrige atalhos de descoberta e mantém os controles visuais coerentes com a Arcora.

## Decisões aprovadas

- O mapa será uma seção própria na página inicial, com cinco regiões selecionáveis: Centro, Norte, Sul, Leste e Oeste.
- A interação com o mapa registra a preferência de forma anônima em `funnel_events`, para que quem não conclui o fluxo de interesse ainda deixe o sinal. O registro não referencia perfil nem `auth.users`; carrega apenas um identificador de sessão que nasce e morre com a aba. *(Revisto em 23/08/2026: a decisão original era não registrar nada.)*
- Ao selecionar uma região, a pessoa abre a busca com a preferência na URL. Ao abrir um espaço, a preferência é mantida na URL e pré-selecionada no formulário.
- A preferência confirmada continua em `pending_interests` e `rental_interests`. A escolha no mapa passa a ter também a coluna `interested_region` em `funnel_events`, criada pela migration `202608230001_region_discovery.sql`. *(Revisto em 23/08/2026: a decisão original dispensava migration.)*
- O mapa terá também cinco botões de região. Eles são a alternativa acessível e o caminho mais simples no celular.
- O catálogo continua centrado em São Paulo. A seção hoje chamada “principais cidades” passa a apresentar regiões de São Paulo com cartões distintos, sem links para slugs de cidades inexistentes.
- “Produções”, “Ensaios” e “Lançamentos” passam a ser opções selecionáveis e utilizam a mesma taxonomia nos cartões e nos filtros. Ensaios e Lançamentos devem retornar espaços compatíveis, sem deixar a busca vazia por divergência de texto.

## Experiência da página inicial

1. A nova seção “Onde você quer realizar seu evento?” aparece após a descoberta por ocasião.
2. O mapa usa a mesma base OpenStreetMap/MapLibre já adotada nas páginas de espaço, centralizado em São Paulo. Cinco marcadores rotulados representam as zonas; clicar em um marcador seleciona a zona.
3. Abaixo do mapa, os botões Centro, Norte, Sul, Leste e Oeste refletem a seleção. Seleção de mapa e botão devem ter o mesmo efeito.
4. Após selecionar uma região, o CTA “Ver espaços nesta região” leva a `/buscar?regionInterest=<região>`. Sem seleção, o CTA não é apresentado.
5. A página de busca mostra a preferência como “Região de interesse” no resumo, mas ela não restringe os resultados: é uma preferência declarada, não um filtro de disponibilidade.
6. Os links dos cartões de espaço preservam `regionInterest` até `/espacos/<slug>?regionInterest=<região>`.

## Experiência do formulário e armazenamento

- A página de espaço lê `regionInterest` da URL somente se for uma das cinco regiões permitidas; caso contrário mantém a zona padrão do espaço.
- O campo “Região de interesse” continua editável. A preferência vinda do mapa é apenas o valor inicial.
- O corpo enviado a `/api/interests` conserva `regionInterest`. O servidor existente segue validando-o e o fluxo de confirmação já o grava no banco.

## Controles e conteúdo

- Os dois selects do formulário de interesse — Ocasião e Região de interesse — deixam de usar a aparência nativa do navegador. Um seletor acessível, com botão, `listbox`, opções, indicador Arcora e abertura para baixo substitui cada um.
- “Enviar pergunta” passa a ser um botão preenchido verde (`var(--primary)`), com texto branco, igual ao CTA de confirmação.
- A seção de cidades passa a se chamar “Explore espaços por região em São Paulo” e apresenta Centro, Oeste e Sul, com fotos distintas e links de busca que já carregam a região como preferência.
- Os três cartões de Guias continuam com suas URLs atuais. A rota dinâmica `/guias/[slug]` é criada, lê os três artigos existentes e entrega título, resumo, um roteiro prático relativo ao tema e CTA para a busca. Slug desconhecido retorna 404.

## Requisitos de qualidade

- Todos os novos controles devem funcionar por teclado, ter rótulos acessíveis e manter área de toque mínima de 44 px.
- O mapa não deve iniciar MapLibre no ambiente de testes.
- A experiência deve adaptar-se de uma coluna no celular para composição ampla no desktop, sem exigir hover.
- Não introduzir dependências novas; reutilizar Next.js, React, MapLibre e o design token `--primary` existentes.
- Cobrir com testes: escolha de região, preservação no link de espaço, pré-seleção no formulário, novos filtros de ocasião, links de regiões, página de guia válida/404 e CTA verde de suporte.

## Fora do escopo

- Limites geográficos em polígonos ou cálculo de distância por bairro.
- Registro de analytics para cliques no mapa.
- Novas cidades. *(Revisto em 23/08/2026: o catálogo passou de 4 para 12 espaços em São Paulo, cobrindo as cinco zonas; continua sem outras cidades.)*
- Alterações ao fluxo de e-mail/Supabase SMTP.
