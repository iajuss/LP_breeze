# Task 2 — Preservar a ocasião selecionada até o detalhe

## Implementação

- `VenueCard` aceita `activity`, canonicaliza a consulta e só a mantém na URL quando ela é uma ocasião suportada pelo espaço. `regionInterest` continua preservada e vem depois de `activity` na query.
- A página de busca repassa a ocasião canônica a cada cartão.
- A página de detalhe canonicaliza `activity`, usa-a como padrão do formulário somente quando pertence a `venue.eventTypes` e recua para `venue.category` nos demais casos.
- O detalhe exibe todas as ocasiões de `venue.eventTypes` em “Indicado para”.

## TDD e verificação

- RED confirmado com `npm test -- src/test/venue-card.test.tsx src/test/interest-form.test.tsx`: quatro falhas esperadas, referentes a links sem `activity`, padrão `Festa` em vez de `Casamento` e ocasiões não exibidas.
- GREEN confirmado com o mesmo comando: 2 arquivos e 23 testes aprovados.
- `npm run lint` e `npx tsc --noEmit` concluíram sem erros.
- A suíte completa tem 124/128 testes aprovados. As quatro falhas restantes estão fora do escopo da Task 2 e correspondem às tarefas seguintes do plano: catálogo/migration de venues e dados de atividade (`search-utils`, `venue-catalogue`, `home-interactions`, `search`). Nenhuma migration, repositório ou campo `residentNeighborhood` foi alterado nesta task.
