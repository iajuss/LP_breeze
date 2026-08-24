insert into public.venues (slug, name, city, neighborhood, zone, latitude, longitude, capacity, event_types, amenities, pricing_label)
values
  ('casa-republica', 'Casa República', 'São Paulo', 'República', 'Centro', -23.5450, -46.6420, 130, array['Casamento', 'Festa', 'Workshop'], array['Casa histórica', 'Salão integrado'], 'Valor sob consulta'),
  ('hub-leopoldina', 'Hub Leopoldina', 'São Paulo', 'Vila Leopoldina', 'Oeste', -23.5280, -46.7280, 180, array['Evento corporativo', 'Reunião', 'Workshop'], array['Salas modulares', 'Internet'], 'Valor sob consulta'),
  ('estacao-lapa', 'Estação Lapa', 'São Paulo', 'Alto da Lapa', 'Oeste', -23.5250, -46.7050, 260, array['Produção', 'Lançamento'], array['Área técnica', 'Pé-direito alto'], 'Valor sob consulta'),
  ('espaco-bosque-saude', 'Espaço Bosque Saúde', 'São Paulo', 'Saúde', 'Sul', -23.6170, -46.6360, 170, array['Casamento', 'Festa', 'Ensaio'], array['Jardim', 'Salão integrado'], 'Valor sob consulta'),
  ('auditorio-barra-funda', 'Auditório Barra Funda', 'São Paulo', 'Barra Funda', 'Centro', -23.5270, -46.6700, 280, array['Evento corporativo', 'Reunião', 'Lançamento'], array['Palco', 'Projeção'], 'Valor sob consulta'),
  ('casa-campo-belo', 'Casa Campo Belo', 'São Paulo', 'Campo Belo', 'Sul', -23.6170, -46.6750, 110, array['Casamento', 'Festa', 'Ensaio'], array['Jardim', 'Terraço'], 'Valor sob consulta'),
  ('pavilhao-penha', 'Pavilhão Penha', 'São Paulo', 'Penha', 'Leste', -23.5240, -46.5470, 320, array['Festa', 'Produção', 'Lançamento'], array['Área ampla', 'Doca de carga'], 'Valor sob consulta'),
  ('sala-itaim', 'Sala Itaim', 'São Paulo', 'Itaim Bibi', 'Sul', -23.5850, -46.6770, 70, array['Reunião', 'Workshop', 'Evento corporativo'], array['Sala reservada', 'Internet'], 'Valor sob consulta')
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
