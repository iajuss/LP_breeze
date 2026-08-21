create extension if not exists pgcrypto;

do $$
begin
  create type public.interest_status as enum ('new', 'contacted', 'qualified', 'closed');
exception
  when duplicate_object then null;
end $$;

create table public.venues (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  city text not null default 'São Paulo' check (city = 'São Paulo'),
  neighborhood text not null,
  zone text not null,
  latitude double precision not null,
  longitude double precision not null,
  capacity integer not null check (capacity > 0),
  event_types text[] not null default '{}',
  amenities text[] not null default '{}',
  pricing_kind text not null default 'on_request' check (pricing_kind in ('on_request', 'from', 'range')),
  pricing_label text not null default 'Valor sob consulta',
  minimum_price integer check (minimum_price is null or minimum_price >= 0),
  maximum_price integer check (maximum_price is null or maximum_price >= minimum_price),
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  phone text not null,
  marketing_consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pending_interests (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete restrict,
  name text not null,
  email text not null,
  phone text not null,
  marketing_consent boolean not null default false,
  event_type text not null,
  neighborhood text not null,
  event_date date,
  guest_count integer not null check (guest_count between 1 and 5000),
  budget text,
  source text,
  campaign text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  finalized_interest_id uuid,
  created_at timestamptz not null default now(),
  finalized_at timestamptz
);

create table public.rental_interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  venue_id uuid not null references public.venues(id) on delete restrict,
  event_type text not null,
  neighborhood text not null,
  event_date date,
  guest_count integer not null check (guest_count between 1 and 5000),
  budget text,
  displayed_price text not null,
  source text,
  campaign text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status public.interest_status not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.pending_interests
  add constraint pending_interests_finalized_interest_id_fkey
  foreign key (finalized_interest_id) references public.rental_interests(id) on delete set null;

create table public.support_inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  venue_id uuid not null references public.venues(id) on delete restrict,
  category text,
  question text not null check (char_length(question) between 10 and 2000),
  event_type text,
  neighborhood text,
  event_date date,
  guest_count integer check (guest_count between 1 and 5000),
  contact_name text,
  contact_email text,
  contact_phone text,
  status public.interest_status not null default 'new',
  created_at timestamptz not null default now()
);

create table public.funnel_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  venue_id uuid references public.venues(id) on delete set null,
  event_type text,
  neighborhood text,
  event_date date,
  guest_count integer check (guest_count between 1 and 5000),
  budget text,
  displayed_price text,
  source text,
  campaign text,
  session_id text,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index venues_neighborhood_idx on public.venues (neighborhood);
create index rental_interests_status_created_at_idx on public.rental_interests (status, created_at desc);
create index rental_interests_venue_id_idx on public.rental_interests (venue_id);
create index support_inquiries_venue_created_at_idx on public.support_inquiries (venue_id, created_at desc);

alter table public.venues enable row level security;
alter table public.profiles enable row level security;
alter table public.pending_interests enable row level security;
alter table public.rental_interests enable row level security;
alter table public.support_inquiries enable row level security;
alter table public.funnel_events enable row level security;

create policy "public can read venues"
  on public.venues for select
  to anon, authenticated
  using (true);

create view public.lead_summary
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
  max(inquiry.created_at) as latest_inquiry_at
from public.rental_interests as interest
join public.profiles as profile on profile.id = interest.user_id
join public.venues as venue on venue.id = interest.venue_id
left join public.support_inquiries as inquiry on inquiry.venue_id = venue.id and inquiry.user_id = profile.id
group by interest.id, profile.id, venue.id;

revoke all on public.lead_summary from anon, authenticated;
grant select on public.lead_summary to service_role;
