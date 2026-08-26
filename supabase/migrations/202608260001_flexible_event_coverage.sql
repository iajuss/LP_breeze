-- Cada espaço ilustrativo pode receber interesse para todas as ocasiões da busca.
-- A categoria principal continua sendo apresentada pelo catálogo da aplicação.
update public.venues
set event_types = array[
  'Festa',
  'Casamento',
  'Evento corporativo',
  'Reunião',
  'Workshop',
  'Produção',
  'Ensaio',
  'Lançamento'
];
