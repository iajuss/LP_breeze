alter table public.pending_interests
  add column if not exists interested_region text check (interested_region in ('Centro', 'Norte', 'Sul', 'Leste', 'Oeste'));

alter table public.rental_interests
  add column if not exists interested_region text check (interested_region in ('Centro', 'Norte', 'Sul', 'Leste', 'Oeste'));

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
  interest.interested_region
from public.rental_interests as interest
join public.profiles as profile on profile.id = interest.user_id
join public.venues as venue on venue.id = interest.venue_id
left join public.support_inquiries as inquiry on inquiry.venue_id = venue.id and inquiry.user_id = profile.id
group by interest.id, profile.id, venue.id;

revoke all on public.lead_summary from anon, authenticated;
grant select on public.lead_summary to service_role;
