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
- Correção posterior de expectativas legadas: `search-utils.test.ts` passou a validar um espaço de ensaio compatível; `home-interactions.test.tsx` resolve os atalhos plurais antes de filtrar; `search.test.tsx` reconhece os três resultados de Reunião.
- `npm test` completo — 28 arquivos e 136 testes aprovados.
- `npm run lint`, `npx tsc --noEmit` e `npm run build` — aprovados. O build mantém apenas o aviso do Next.js sobre múltiplos lockfiles.

## Riscos

- O bairro residencial continua texto livre por decisão do brief; a API já normaliza e valida o valor.
- O build informa múltiplos lockfiles no diretório pai e no worktree; é um aviso de configuração, sem falha de compilação.
