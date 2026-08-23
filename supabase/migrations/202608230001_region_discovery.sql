-- Registra a regiao escolhida no mapa antes de qualquer identificacao.
-- funnel_events nao referencia profiles nem auth.users: o registro e anonimo
-- por construcao e sobrevive a quem abandona o fluxo de interesse.
alter table public.funnel_events
  add column if not exists interested_region text
  check (interested_region in ('Centro', 'Norte', 'Sul', 'Leste', 'Oeste'));

create index if not exists funnel_events_interested_region_idx
  on public.funnel_events (interested_region, occurred_at desc)
  where interested_region is not null;

insert into public.venues (slug, name, city, neighborhood, zone, latitude, longitude, capacity, event_types, amenities, pricing_label)
values
  ('salao-bela-vista', 'Salão Bela Vista', 'São Paulo', 'Bela Vista', 'Centro', -23.558, -46.644, 140, array['Workshop', 'Reunião'], array['Pé-direito alto', 'Próximo ao metrô'], 'Valor sob consulta'),
  ('sobrado-perdizes', 'Sobrado Perdizes', 'São Paulo', 'Perdizes', 'Oeste', -23.537, -46.68, 60, array['Reunião', 'Workshop'], array['Salas reservadas', 'Quintal'], 'Valor sob consulta'),
  ('atelie-santana', 'Ateliê Santana', 'São Paulo', 'Santana', 'Norte', -23.501, -46.625, 110, array['Workshop', 'Produção'], array['Bancadas móveis', 'Boa acústica'], 'Valor sob consulta'),
  ('patio-casa-verde', 'Pátio Casa Verde', 'São Paulo', 'Casa Verde', 'Norte', -23.513, -46.662, 220, array['Festa', 'Casamento'], array['Pátio coberto', 'Área verde'], 'Valor sob consulta'),
  ('galeria-tatuape', 'Galeria Tatuapé', 'São Paulo', 'Tatuapé', 'Leste', -23.54, -46.576, 160, array['Evento corporativo', 'Lançamento'], array['Projeção', 'Camarim'], 'Valor sob consulta'),
  ('armazem-mooca', 'Armazém Mooca', 'São Paulo', 'Mooca', 'Leste', -23.554, -46.599, 400, array['Produção', 'Festa'], array['Doca de carga', 'Energia trifásica'], 'Valor sob consulta'),
  ('jardim-moema', 'Jardim Moema', 'São Paulo', 'Moema', 'Sul', -23.601, -46.665, 130, array['Casamento', 'Festa'], array['Jardim arborizado', 'Terraço coberto'], 'Valor sob consulta'),
  ('estudio-santo-amaro', 'Estúdio Santo Amaro', 'São Paulo', 'Santo Amaro', 'Sul', -23.654, -46.708, 80, array['Produção', 'Ensaio'], array['Fundo infinito', 'Estacionamento'], 'Valor sob consulta')
on conflict (slug) do update set
  name = excluded.name,
  neighborhood = excluded.neighborhood,
  zone = excluded.zone,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  capacity = excluded.capacity,
  event_types = excluded.event_types,
  amenities = excluded.amenities,
  pricing_label = excluded.pricing_label;
