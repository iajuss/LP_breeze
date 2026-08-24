# Catálogo múltiplo e origem da demanda — especificação

## Objetivo

Ampliar o catálogo ilustrativo da Arcora para que a validação de demanda cubra mais combinações de bairro e ocasião, permitindo que cada espaço seja compatível com vários tipos de evento. Registrar, em cada pedido confirmado, o bairro onde a pessoa mora para distinguir origem da demanda de local desejado para o evento.

## Decisões aprovadas

- Todos os espaços continuam ilustrativos, com preço sob consulta e disponibilidade confirmada no atendimento; não há alegação de disponibilidade imediata nem vínculo com proprietário.
- O catálogo passará de 12 para cerca de 20 espaços, distribuídos entre Centro, Oeste, Sul, Norte e Leste de São Paulo.
- Um espaço pode ter múltiplas ocasiões compatíveis. A mesma lista é usada em cartões, busca, detalhe, formulário e no campo `venues.event_types` do Supabase.
- Uma busca por Casamento em Pinheiros deve encontrar opções compatíveis, incluindo a Casa Jardim Pinheiros.
- A ocasião selecionada na busca continua até a página do espaço e é o valor inicial do formulário de interesse.
- O formulário terá dois campos distintos:
  - `eventNeighborhood` / “Onde quer realizar?”: local desejado para o evento, já existente no fluxo como `neighborhood`.
  - `residentNeighborhood` / “Em que bairro você mora?”: obrigatório e declarado diretamente pela pessoa.
- Não será usada localização por IP, GPS ou outro mecanismo invisível. O bairro residencial só é salvo quando a pessoa envia o pedido.
- O novo dado é salvo em `pending_interests` e copiado a `rental_interests` ao confirmar o e-mail. O resumo de leads exibirá `event_neighborhood` e `resident_neighborhood` separadamente.

## Catálogo e descoberta

1. O tipo `Venue` passa a incluir `eventTypes: string[]`; `category` continua como rótulo principal de apresentação para evitar quebra visual.
2. As ocasiões permitidas permanecem a taxonomia compartilhada atual: Festa, Casamento, Evento corporativo, Reunião, Workshop, Produção, Ensaio e Lançamento.
3. A busca compara a ocasião escolhida com `venue.eventTypes`, e não somente com `venue.category`.
4. Todos os espaços recebem pelo menos duas ocasiões quando forem plausivelmente compatíveis. Exemplos: Casa Jardim Pinheiros (Festa, Casamento, Ensaio); Galpão da Luz (Produção, Workshop, Lançamento); Terraço Vila Madalena (Evento corporativo, Workshop, Lançamento, Festa).
5. Serão adicionados oito espaços ilustrativos, com fotos existentes do catálogo e dados coerentes de capacidade, bairro, zona e ocasiões: Espaço Pompeia, Villa Butantã, Casa Aclimação, Estúdio Berrini, Pavilhão Ibirapuera, Sala Consolação, Armazém Brás e Jardim Anália.
6. A migration de seed atualiza `public.venues.event_types` dos espaços existentes e insere/atualiza os oito novos por slug. Ela é segura para reexecução.
7. O detalhe mostra todas as ocasiões em “Indicado para”; ao chegar por `/buscar?activity=<ocasião>`, a query é preservada no link do cartão e define a ocasião inicial do formulário se for válida para aquele espaço.

## Dados de origem da demanda

1. Criar migration aditiva que adiciona `resident_neighborhood text` a `pending_interests` e `rental_interests`.
2. O formulário envia `residentNeighborhood`; a validação exige texto não vazio, remove espaços externos e limita a 100 caracteres. Não restringe a bairros de São Paulo, pois a origem pode ser de outra cidade.
3. `createPendingInterest` persiste o campo; `finalizePendingInterest` o copia para o lead confirmado.
4. `lead_summary` é recriada com nomes sem ambiguidade: `event_neighborhood` vindo do interesse e `resident_neighborhood` vindo da pessoa. A consulta continua restrita ao `service_role`.
5. O formulário explica o propósito do campo: “Usamos esta informação para entender de onde vem a demanda.”

## Requisitos de interface

- Renomear o campo atual do formulário para “Onde quer realizar?” para evitar confusão com o bairro residencial.
- Inserir “Em que bairro você mora?” logo após o local desejado, com sugestão por `datalist` de bairros já presentes no catálogo, mas permitindo digitação livre.
- Manter a experiência responsiva, os controles Arcora existentes e áreas de toque de 44 px.
- Não alterar o fluxo de confirmação por e-mail nem armazenar bairro residencial para perguntas de suporte.

## Testes e qualidade

- Testar `filterVenues` com todas as ocasiões presentes em `eventTypes`, incluindo Casamento em Pinheiros.
- Testar que a query `activity` é preservada nos links para detalhe e pré-seleciona o formulário somente quando a ocasião é compatível.
- Testar validação de `residentNeighborhood` ausente e normalização de entrada válida.
- Testar persistência do novo campo no repositório e sua presença no SQL/view `lead_summary`.
- Executar suíte completa, lint e build depois das mudanças.

## Fora do escopo

- Cadastro de espaços reais, disponibilidade em tempo real ou integração com proprietários.
- Geolocalização automática, enriquecimento por IP ou coleta de endereço completo.
- Mudanças no provedor de e-mail, autenticação ou permissões de Supabase além da migration necessária.
