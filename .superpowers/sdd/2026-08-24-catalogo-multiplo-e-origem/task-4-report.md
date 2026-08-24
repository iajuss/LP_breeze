# Task 4 — Campo residencial no formulário

## Commit

- `773a2b7 feat: coleta origem residencial no interesse`

## Arquivos alterados

- `src/components/venue/interest-form.tsx`
- `src/test/interest-form.test.tsx`
- `src/test/support-form.test.tsx`

## Comportamento entregue

- O formulário separa o bairro do evento (`neighborhood`, em “Onde quer realizar?”) do bairro residencial obrigatório (`residentNeighborhood`, em “Em que bairro você mora?”).
- O campo residencial oferece sugestões de `locationOptions`, aceita texto livre, traz o exemplo “Ex.: Moema” e explica o uso do dado.
- O payload de interesse inclui `residentNeighborhood`; os estados já existentes de carregamento, sucesso e erro continuam cobertos pelos testes de submissão.
- O payload de perguntas de suporte é protegido por teste para não receber `residentNeighborhood`.

## Testes e verificação

- RED confirmado: o novo teste falhou inicialmente porque o rótulo/campo residencial não existia.
- GREEN: `npm test -- src/test/interest-form.test.tsx src/test/interest-route.test.ts src/test/interest-route-logging.test.ts src/test/support-form.test.tsx` — 4 arquivos, 25 testes aprovados.
- `npm run lint` — aprovado.
- `npm run build` — aprovado, com o aviso preexistente do Next.js sobre múltiplos lockfiles.
- `npm test` completo — 133 de 136 testes aprovados; falhas fora do escopo da Task 4 em `search-utils.test.ts`, `home-interactions.test.tsx` e `search.test.tsx`, relacionadas às expectativas do catálogo/atalhos de ocasiões.

## Riscos

- A suíte completa ainda requer ajuste das expectativas do catálogo das Tasks 1–3 antes de poder ficar totalmente verde.
- O bairro residencial continua texto livre por decisão do brief; a API já normaliza e valida o valor.
