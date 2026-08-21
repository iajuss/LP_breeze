# Arcora — MVP de validação de demanda

**Data:** 2026-08-21

**Status:** aprovado para especificação; aguardando revisão da especificação e planejamento
**Escopo:** transformar a landing aprovada em um funil funcional de intenção de locação de espaços exclusivamente em São Paulo.

## 1. Objetivo e critério de sucesso

O produto deve permitir que alguém encontre um espaço compatível em São Paulo, faça uma pergunta ou manifeste intenção real de locação, e deixe dados suficientes para acompanhamento comercial.

O experimento é bem-sucedido quando a equipe consegue consultar, para cada interesse enviado: contato, espaço, bairro, tipo e data de evento, quantidade de convidados, preço/ticket, origem, data e status do atendimento. O sistema também precisa permitir medir a passagem por busca, resultados, detalhe, CTA e envio.

Não há pagamento, reserva confirmada, disponibilidade em tempo real, área pública de conta, favoritos ou blog publicado neste MVP.

## 2. Princípios de produto

- **Valor antes de fricção:** pesquisa, resultados e detalhe são públicos. Identificação ocorre apenas ao solicitar disponibilidade.
- **Contexto não se repete:** URL e estado da busca preenchem automaticamente o detalhe, dúvida e interesse.
- **São Paulo por padrão:** a cidade não é um filtro. A localização selecionável é um bairro/região válido da cidade.
- **Somente interações verdadeiras:** uma ação persistirá dados, navegará para um destino válido ou não será exibida.
- **Sem confiança fabricada:** avaliações, depoimentos, badges e preços não verificados não serão publicados.

## 3. Marca e conteúdo público

O nome provisório é **Arcora**. Ele será exposto por uma configuração única consumida por cabeçalho, rodapé, metadata, JSON-LD, nomes de eventos, título e copy. O nome Breeze, suas variações e o evento `breeze:*` serão eliminados do produto, testes, metadata e documentação exibida.

“Demo”, “dados demonstrativos”, avaliações demonstrativas e textos equivalentes deixam de ser publicados. Dados seed de venues continuam sendo tratados como catálogo técnico até substituição por inventário verificado, sem alegar avaliações ou disponibilidade real.

O blog mantém somente estrutura de dados futura; não haverá navegação, cards ou rotas públicas para artigos sem publicação real.

## 4. Navegação e busca

### 4.1 Fonte única de verdade

A busca usa query params normalizados em `/buscar`:

```
/buscar?eventType=aniversario&neighborhood=pinheiros&date=2026-11-15&guestCount=80&budget=3000-5000
```

`eventType`, `neighborhood`, `date`, `guestCount` e `budget` são a única fonte compartilhável da busca. Home, resultados, mapa, detalhe, voltar/avançar e refresh leem essa mesma fonte. Não haverá cópia concorrente em localStorage ou estado global.

### 4.2 Localização controlada

Uma taxonomia local tipada contém bairros e regiões elegíveis de São Paulo, incluindo nome, slug, zona e sinônimos de busca. A interface permite digitar para filtrar sugestões, mas só atribui `neighborhood` após seleção de uma entidade válida. Uma entrada sem seleção produz orientação e bloqueia o submit.

As sugestões mostram, por exemplo, `Pinheiros · Zona Oeste`, e a home pode destacar regiões populares sem converter a experiência em um select gigante.

### 4.3 Resultados e filtros

Resultados aplicam de verdade os filtros relevantes: tipo de evento, bairro/região, capacidade mínima e faixa de preço. A data é preservada e exibida como contexto; até existir disponibilidade confiável no catálogo, ela não alegará filtrar disponibilidade.

Quando não houver correspondência, a página mostrará estado vazio honesto e alternativa para ajustar filtros — nunca todo o catálogo como se correspondesse à busca inválida. A lateral representa as opções válidas, incluindo o bairro selecionado, e não cidades genéricas.

## 5. Espaço e mapa

Cada card navega para `/espacos/[slug]`, preservando a query da busca. O detalhe apresenta nome, galeria, bairro/região, capacidade, tipos de evento, comodidades, modelo de preço/valor apresentado e CTA principal **Solicitar disponibilidade**. Não haverá avaliações ou promessas de disponibilidade.

O mapa usa **MapLibre + OpenStreetMap** com coordenadas reais do catálogo de São Paulo. Desktop usa lista e mapa; mobile alterna entre lista e mapa. Pins são derivados dos mesmos resultados filtrados, um pin destaca o card e um card destaca o pin. Falhas de carregamento deixam uma lista plenamente funcional com explicação curta; o mapa não carrega na home.

## 6. Identificação, interesse e suporte

### 6.1 Autenticação progressiva

Ao clicar no CTA, o visitante vê somente os dados necessários: nome, e-mail, telefone/WhatsApp e uma confirmação curta do evento. A autenticação usa magic link do Supabase; não existe senha tradicional. A submissão cria ou associa o usuário e grava o interesse somente após a operação do servidor ser bem-sucedida.

O checkbox de marketing é opcional, desmarcado e separado do aviso necessário para responder à solicitação. O visitante vê confirmação apenas depois da persistência: a solicitação foi recebida e a equipe entrará em contato para confirmar detalhes e disponibilidade.

### 6.2 Interesse

O domínio usa `rental_interests`. Ao enviar, o servidor herda da URL e do venue: venue, bairro, tipo, data, convidados, faixa de orçamento, preço/modelo exibido, source/campaign/UTMs, referrer quando presente e timestamp. Campos já conhecidos não são perguntados novamente.

### 6.3 Dúvidas

No detalhe, **Tirar uma dúvida** abre um formulário assíncrono para a equipe, não um chatbot. Atalhos opcionais incluem disponibilidade, preço, capacidade, estacionamento, buffet, horário, equipamentos e visita; há uma opção livre. A dúvida persiste venue, página, busca, usuário quando houver, contato quando necessário, pergunta, categoria e timestamp.

## 7. Persistência e consulta operacional

Supabase fornece Postgres e autenticação. Route Handlers do Next.js são a fronteira exclusiva para criação e leitura de dados; componentes cliente não escrevem diretamente no banco. Segredos ficam somente em variáveis de ambiente do servidor.

Tabelas mínimas:

- `venues`: slug, nome, bairro, zona, latitude, longitude, capacidade, tipos, comodidades e preço/modelo.
- `users`: id de autenticação, nome, e-mail, telefone, consentimento opcional de marketing e criação.
- `rental_interests`: usuário, venue, contexto do evento, ticket exibido/selecionado, origem, status e criação.
- `support_inquiries`: usuário opcional, venue, pergunta, categoria, contexto de busca, status e criação.
- `funnel_events`: evento, contexto não sensível, identificadores técnicos e timestamp.

Uma view privada `lead_summary` reúne usuário, venue, interesse e dúvidas relacionadas. A equipe consulta a view no Supabase Dashboard, com status `new`, `contacted`, `qualified` ou `closed`. Não será criado um painel administrativo nesta rodada; a view é o contrato para um painel futuro.

## 8. Tracking

Uma biblioteca central define nomes, propriedades permitidas e transporte dos eventos. Eventos são enviados por um Route Handler e persistidos em `funnel_events`; não são apenas `console.log` ou `CustomEvent` local.

Eventos mínimos: `landing_viewed`, `search_started`, `event_type_selected`, `region_selected`, `date_selected`, `guest_count_selected`, `search_submitted`, `search_results_viewed`, `search_filter_applied`, `map_opened`, `map_marker_clicked`, `venue_card_clicked`, `venue_viewed`, `interest_cta_clicked`, `signup_started`, `signup_completed`, `rental_interest_started`, `rental_interest_submitted`, `support_opened` e `support_question_submitted`.

Os eventos levam apenas contexto apropriado: venue, tipo, bairro, convidados, data, faixa/preço e UTMs quando conhecidos. Senha, conteúdo da pergunta, e-mail, telefone e nome nunca entram em analytics. PII fica nas tabelas operacionais.

## 9. FAQ, links e remoções

A FAQ permanece configurável por dados e responde objetivamente a dúvidas de locação sem inventar políticas: processo, busca gratuita, criação de conta, visita, disponibilidade, preço, fornecedores, buffet, horário, som, cancelamento, confirmação, orçamento, capacidade, corporativo, estacionamento, limpeza, acessibilidade e dúvidas específicas.

Não foi encontrada uma referência Ettinger inequívoca no repositório ou histórico; portanto a FAQ será baseada nessas objeções, sem alegar comparação com a referência.

Itens não implementáveis nesta rodada são removidos da interface: favoritos em memória, links `#` sem âncora real, cidades fora de São Paulo, cards de blog sem publicação, rotas inexistentes e chamadas que pareçam operação real mas não persistam dados.

## 10. Erros e segurança

- Uma localização inválida não gera resultados nem fallback enganoso.
- Falhas de autenticação, persistência ou rede apresentam mensagem acionável e preservam o formulário; nunca exibem sucesso falso.
- RLS e Route Handlers impedem leitura pública de contatos, interesses e perguntas.
- A conta técnica do servidor é a única usada para operações internas e consultas agregadas.
- A coleta necessária para responder ao pedido é explicitada; marketing não é pré-selecionado.

## 11. Testes e verificação

TDD cobre, antes da implementação de cada fluxo:

1. home → URL → resultados com filtros já preenchidos;
2. autocomplete de `pinh` para Pinheiros e bloqueio de localização inválida;
3. filtros reais e estado vazio honesto;
4. lista/mapa com o mesmo conjunto de venues;
5. detalhe → CTA → identificação → interesse persistido;
6. herança de contexto da busca;
7. dúvida persistida com contexto do venue;
8. São Paulo como único mercado público;
9. eventos críticos com propriedades permitidas;
10. refresh, voltar e avançar preservando a busca.

Antes da entrega: lint, TypeScript, testes unitários, integração, build e E2E desktop/mobile dos fluxos críticos. Também haverá inspeção visual de home, resultados, mapa, detalhe, interesse e suporte, além de console e requisições de rede.

## 12. Fora de escopo

- pagamento e reserva;
- calendário de disponibilidade real;
- favoritos e área pública de conta;
- blog publicado e CMS;
- painel administrativo próprio;
- chatbot de IA;
- OAuth com múltiplos provedores;
- inventário fora da cidade de São Paulo.
