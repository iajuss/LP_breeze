alter table public.pending_interests
  add column if not exists resident_neighborhood text;

alter table public.rental_interests
  add column if not exists resident_neighborhood text;

update public.pending_interests
set resident_neighborhood = 'Não informado'
where resident_neighborhood is null;

update public.rental_interests
set resident_neighborhood = 'Não informado'
where resident_neighborhood is null;

alter table public.pending_interests
  alter column resident_neighborhood set not null;

alter table public.rental_interests
  alter column resident_neighborhood set not null;

insert into public.venues (slug, name, city, neighborhood, zone, latitude, longitude, capacity, event_types, amenities, pricing_label)
values
  ('casa-jardim-pinheiros', 'Casa Jardim Pinheiros', 'São Paulo', 'Pinheiros', 'Oeste', -23.5614, -46.6912, 120, array['Festa', 'Casamento', 'Ensaio'], array['Jardim', 'Moderno'], 'Valor sob consulta'),
  ('galpao-da-luz', 'Galpão da Luz', 'São Paulo', 'Luz', 'Centro', -23.5347, -46.6357, 300, array['Produção', 'Workshop', 'Lançamento'], array['Industrial', 'Estúdio'], 'Valor sob consulta'),
  ('terraco-vila-madalena', 'Terraço Vila Madalena', 'São Paulo', 'Vila Madalena', 'Oeste', -23.5527, -46.6915, 180, array['Evento corporativo', 'Workshop', 'Lançamento', 'Festa'], array['Rooftop', 'Moderno'], 'Valor sob consulta'),
  ('casa-vila-mariana', 'Casa Vila Mariana', 'São Paulo', 'Vila Mariana', 'Sul', -23.5895, -46.6377, 90, array['Casamento', 'Festa', 'Ensaio'], array['Histórico', 'Jardim'], 'Valor sob consulta'),
  ('salao-bela-vista', 'Salão Bela Vista', 'São Paulo', 'Bela Vista', 'Centro', -23.5580, -46.6440, 140, array['Workshop', 'Reunião', 'Evento corporativo'], array['Histórico', 'Moderno'], 'Valor sob consulta'),
  ('sobrado-perdizes', 'Sobrado Perdizes', 'São Paulo', 'Perdizes', 'Oeste', -23.5370, -46.6800, 60, array['Reunião', 'Workshop'], array['Histórico', 'Jardim'], 'Valor sob consulta'),
  ('atelie-santana', 'Ateliê Santana', 'São Paulo', 'Santana', 'Norte', -23.5010, -46.6250, 110, array['Workshop', 'Produção', 'Ensaio'], array['Estúdio', 'Moderno'], 'Valor sob consulta'),
  ('patio-casa-verde', 'Pátio Casa Verde', 'São Paulo', 'Casa Verde', 'Norte', -23.5130, -46.6620, 220, array['Festa', 'Casamento', 'Lançamento'], array['Jardim', 'Industrial'], 'Valor sob consulta'),
  ('galeria-tatuape', 'Galeria Tatuapé', 'São Paulo', 'Tatuapé', 'Leste', -23.5400, -46.5760, 160, array['Evento corporativo', 'Lançamento', 'Produção'], array['Moderno', 'Estúdio'], 'Valor sob consulta'),
  ('armazem-mooca', 'Armazém Mooca', 'São Paulo', 'Mooca', 'Leste', -23.5540, -46.5990, 400, array['Produção', 'Festa', 'Lançamento'], array['Industrial', 'Estúdio'], 'Valor sob consulta'),
  ('jardim-moema', 'Jardim Moema', 'São Paulo', 'Moema', 'Sul', -23.6010, -46.6650, 130, array['Casamento', 'Festa', 'Ensaio'], array['Jardim', 'Rooftop'], 'Valor sob consulta'),
  ('estudio-santo-amaro', 'Estúdio Santo Amaro', 'São Paulo', 'Santo Amaro', 'Sul', -23.6540, -46.7080, 80, array['Produção', 'Ensaio', 'Workshop'], array['Estúdio', 'Industrial'], 'Valor sob consulta'),
  ('espaco-pompeia', 'Espaço Pompeia', 'São Paulo', 'Pompeia', 'Oeste', -23.5290, -46.6900, 220, array['Festa', 'Evento corporativo', 'Lançamento'], array['Área ampla', 'Projeção'], 'Valor sob consulta'),
  ('villa-butanta', 'Villa Butantã', 'São Paulo', 'Butantã', 'Oeste', -23.5710, -46.7080, 150, array['Casamento', 'Festa', 'Ensaio'], array['Jardim', 'Plano B coberto'], 'Valor sob consulta'),
  ('casa-aclimacao', 'Casa Aclimação', 'São Paulo', 'Aclimação', 'Centro', -23.5740, -46.6320, 100, array['Casamento', 'Festa', 'Workshop'], array['Casa histórica', 'Área externa'], 'Valor sob consulta'),
  ('estudio-berrini', 'Estúdio Berrini', 'São Paulo', 'Brooklin', 'Sul', -23.6100, -46.6970, 120, array['Produção', 'Evento corporativo', 'Lançamento'], array['Estúdio', 'Estacionamento'], 'Valor sob consulta'),
  ('pavilhao-ibirapuera', 'Pavilhão Ibirapuera', 'São Paulo', 'Ibirapuera', 'Sul', -23.5870, -46.6570, 350, array['Evento corporativo', 'Lançamento', 'Festa'], array['Pavilhão', 'Acessibilidade'], 'Valor sob consulta'),
  ('sala-consolacao', 'Sala Consolação', 'São Paulo', 'Consolação', 'Centro', -23.5530, -46.6600, 60, array['Reunião', 'Workshop'], array['Sala reservada', 'Internet'], 'Valor sob consulta'),
  ('armazem-bras', 'Armazém Brás', 'São Paulo', 'Brás', 'Centro', -23.5470, -46.6160, 450, array['Produção', 'Lançamento', 'Festa'], array['Doca de carga', 'Pé-direito alto'], 'Valor sob consulta'),
  ('jardim-analia', 'Jardim Anália', 'São Paulo', 'Anália Franco', 'Leste', -23.5600, -46.5650, 140, array['Casamento', 'Festa', 'Ensaio'], array['Jardim', 'Terraço'], 'Valor sob consulta')
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

create or replace view public.lead_summary
with (security_invoker = true)
as
select
  interest.id,
  interest.created_at,
  interest.status,
  profile.name,
  profile.email,
  profile.phone,
  venue.name as venue_name,
  venue.slug as venue_slug,
  venue.neighborhood as venue_neighborhood,
  interest.event_type,
  interest.event_date,
  interest.guest_count,
  interest.budget,
  interest.displayed_price,
  interest.source,
  interest.campaign,
  count(inquiry.id)::integer as inquiry_count,
  max(inquiry.created_at) as latest_inquiry_at,
  interest.interested_region,
  interest.neighborhood as event_neighborhood,
  interest.resident_neighborhood,
  interest.referrer,
  interest.utm_source,
  interest.utm_medium,
  interest.utm_campaign
from public.rental_interests as interest
join public.profiles as profile on profile.id = interest.user_id
join public.venues as venue on venue.id = interest.venue_id
left join public.support_inquiries as inquiry on inquiry.venue_id = venue.id and inquiry.user_id = profile.id
group by interest.id, profile.id, venue.id;

revoke all on public.lead_summary from anon, authenticated;
grant select on public.lead_summary to service_role;
